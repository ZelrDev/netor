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
  DBGuildMemberPunishments,
  getDBGuildMemberPunishments,
  removeDBGuildMemberPunishment,
} from "~/models/dbGuildPunishments.server";
import { UserPunishmentTable } from "~/components/users/UserPunishmentTable";
import { getAPIUser, APIUser } from "~/requests/apiUser";
import { APIMessage } from "types/APIMessage";
import { useEffect, useState } from "react";
import { error } from "~/utils";
import errors from "~/errors.json";
import { DoubleNavbar } from "~/components/Navbar";

type LoaderData = {
  dbGuild: DBGuild;
  apiGuild: APIGuild;
  apiUser: APIUser | undefined;
  apiGuildMember: APIGuildMember | undefined;
  apiGuildMemberBan: APIGuildMemberBan;
  dbGuildMemberPunishments: DBGuildMemberPunishments;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const uri = session.get("uuid");

  error(params.guild, `params.guild is required`, 400);
  error(uri, `session is required`, 400);
  error(params.member, `params.member is required`, 400);

  const [
    dbGuild,
    apiGuild,
    apiGuildMember,
    dbGuildMemberPunishments,
    apiGuildMemberBan,
  ] = await Promise.all([
    getDBGuild(params.guild, uri),
    getAPIGuild(params.guild, uri),
    getAPIGuildMember(params.guild, uri, params.member),
    getDBGuildMemberPunishments(params.guild, params.member, uri, true),
    getAPIGuildMemberBan(params.guild, uri, params.member),
  ]);

  error(apiGuild.completed, errors.GET_API_GUILD_FAIL, 401);

  let apiUser: APIMessage<APIUser> | undefined = undefined;

  if (!apiGuildMember.completed) {
    apiUser = await getAPIUser(params.guild, params.member, uri);
    error(apiUser.completed, errors.GET_API_USER_FAIL, 404);
  }

  error(apiGuildMemberBan.completed === true, errors.GET_DB_PUNISHMENTS_FAIL);

  return json<LoaderData>({
    dbGuild,
    apiGuild: apiGuild.result!,
    apiUser: apiUser?.result,
    apiGuildMember: apiGuildMember.result,
    apiGuildMemberBan: apiGuildMemberBan.result!,
    dbGuildMemberPunishments,
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

  if (data.get("remove_punishment") === "true") {
    const id = data.get("punishment_id")?.toString();

    error(id, "punishment_id is required", 400, true);

    await removeDBGuildMemberPunishment(id, true);
  }
  if (data.get("remove_timeout") === "true") {
    const id = data.get("user_id")?.toString();
    error(id, "id is required", 400, true);

    const result = await removeTimeoutAPIGuildMember(params.guild, uri, id);
    error(result.result, result.message, 500, true);
  }
  if (data.get("remove_ban") === "true") {
    const id = data.get("user_id")?.toString();
    error(id, "id is required", 400, true);

    const result = await removeBanAPIGuildMember(params.guild, uri, id);
    error(result.result, result.message, 500, true);
  }

  return "OK";
};

export default function Index() {
  let { apiUser, dbGuildMemberPunishments, apiGuildMember, apiGuildMemberBan } =
    useLoaderData() as LoaderData;

  const [banned, setBanned] = useState<boolean>(false);

  useEffect(() => {
    if (apiGuildMemberBan == null) {
      setBanned(false);
    } else {
      setBanned(true);
    }
  }, []);

  if (apiUser === undefined) {
    apiUser = apiGuildMember!.user!;
  }

  const params = useParams();

  const navigateURL = (path: string) => `/${params.guild}/${path}`;
  const navigateUserURL = (id: string) => `/${params.guild}/users/${id}`;

  const punishmentsSorted = dbGuildMemberPunishments.sort(
    (a, b) => new Date(b.date).valueOf() - new Date(a.date).valueOf()
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
            href: banned ? undefined : navigateUserURL(params.member!),
          },
          {
            title: "Punishment History",
            href: navigateUserURL(params.member! + "/punishment-history"),
          },
        ]}
      />
      <Title order={1}>Punishment History</Title>
      <UserPunishmentTable
        banned={banned}
        user={apiUser}
        member={apiGuildMember}
        punishments={punishmentsSorted}
      />
    </DoubleNavbar>
  );
}
