import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, useParams } from "@remix-run/react";
import { getDBGuild, validateSessionURI } from "~/models/dbGuild.server";
import { getAPIGuild } from "~/requests/apiGuild.server";
import type { DBGuild } from "~/models/dbGuild.server";
import type { APIGuild } from "~/requests/apiGuild.server";
import { getSession } from "~/sessions";
import {
  APIGuildMemberBan,
  getAPIGuildMember,
  getAPIGuildMemberBan,
  removeBanAPIGuildMember,
  removeTimeoutAPIGuildMember,
} from "~/requests/apiGuildMember.server";
import type { APIGuildMember } from "~/requests/apiGuildMember.server";
import { HeaderSimple } from "~/components/Header";
import { Breadcrumbs } from "~/components/Breadcrumbs";
import { Container, Title } from "@mantine/core";
import {
  DBGuildMemberInvites,
  DBGuildMemberPunishments,
  getDBGuildMemberInvites,
  getDBGuildMemberInvitesRAW,
  getDBGuildMemberPunishments,
  removeDBGuildMemberInvite,
  removeDBGuildMemberPunishment,
} from "~/models/dbGuildMember.server";
import { UserPunishmentTable } from "~/components/users/UserPunishmentTable";
import { getAPIUser, APIUser } from "~/requests/apiUser";
import { APIMessage } from "types/APIMessage";
import { useEffect, useState } from "react";
import { error } from "~/utils";
import errors from "~/errors.json";
import { DoubleNavbar } from "~/components/Navbar";
import { InviteTable } from "~/components/users/InviteTable";

type LoaderData = {
  dbGuild: DBGuild;
  apiGuild: APIGuild;
  apiUser: APIUser | undefined;
  apiGuildMember: APIGuildMember | undefined;
  dbGuildMemberInvites: DBGuildMemberInvites;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const uri = session.get("uuid");

  error(params.guild, `params.guild is required`, 400);
  error(uri, `session is required`, 400);
  error(params.member, `params.member is required`, 400);

  const [dbGuild, apiGuild, apiGuildMember, dbGuildMemberInvites] =
    await Promise.all([
      getDBGuild(params.guild, uri),
      getAPIGuild(params.guild, uri),
      getAPIGuildMember(params.guild, uri, params.member),
      getDBGuildMemberInvites(params.guild, params.member, uri),
    ]);

  error(apiGuild.completed, errors.GET_API_GUILD_FAIL, 401);

  let apiUser: APIMessage<APIUser> | undefined = undefined;

  if (!apiGuildMember.completed) {
    apiUser = await getAPIUser(params.guild, params.member, uri);
    error(apiUser.completed, errors.GET_API_USER_FAIL, 404);
  }

  return json<LoaderData>({
    dbGuild,
    dbGuildMemberInvites,
    apiGuild: apiGuild.result!,
    apiUser: apiUser?.result,
    apiGuildMember: apiGuildMember.result,
  });
};

export const action: ActionFunction = async ({ request, params }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const uri = session.get("uuid");

  error(params.guild, `params.guild is required`, 400, true);
  error(uri, `session is required`, 400, true);

  const data = await request.formData();

  const validate = await validateSessionURI(params.guild, uri, true);
  error(validate, errors.VALIDATE_DB_GUILD_FAIL, 401, true);

  if (data.get("remove_invite") === "true") {
    const id = data.get("invite_id")?.toString();

    error(id, "invite_id is required", 400, true);

    await removeDBGuildMemberInvite(id, true);
  }

  return "OK";
};

export default function Index() {
  let { apiUser, apiGuildMember, dbGuildMemberInvites } =
    useLoaderData() as LoaderData;

  if (apiUser === undefined) {
    apiUser = apiGuildMember!.user!;
  }

  const params = useParams();

  const navigateURL = (path: string) => `/${params.guild}/${path}`;
  const navigateUserURL = (id: string) => `/${params.guild}/users/${id}`;

  const invitesSorted = dbGuildMemberInvites.sort(
    (a, b) =>
      new Date(b.date_created).valueOf() - new Date(a.date_created).valueOf()
  );

  return (
    <DoubleNavbar>
      <Breadcrumbs
        items={[
          {
            title: "Users",
            href: navigateURL("users"),
          },
          {
            title: apiUser!.username,
            href: navigateUserURL(params.member!),
          },
          {
            title: "Invite History",
            href: navigateUserURL(params.member! + "/invite-history"),
          },
        ]}
      />
      <Title order={1}>Invite History</Title>
      <InviteTable
        invites={invitesSorted}
        user={apiUser}
        member={apiGuildMember}
      />
    </DoubleNavbar>
  );
}
