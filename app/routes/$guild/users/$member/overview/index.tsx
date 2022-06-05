import { ActionFunction, LoaderFunction, redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, useParams } from "@remix-run/react";
import { getDBGuild, validateSessionURI } from "~/models/dbGuild.server";
import { getAPIGuild } from "~/requests/apiGuild.server";
import type { DBGuild } from "~/models/dbGuild.server";
import type { APIGuild } from "~/requests/apiGuild.server";
import { getSession } from "~/sessions";
import {
  banAPIGuildMember,
  getAPIGuildMember,
  kickAPIGuildMember,
  removeTimeoutAPIGuildMember,
  timeoutAPIGuildMember,
} from "~/requests/apiGuildMember.server";
import type { APIGuildMember } from "~/requests/apiGuildMember.server";
import { PunishmentButtons } from "~/components/users/PunishmentButtons";
import { HeaderSimple } from "~/components/Header";
import { Breadcrumbs } from "~/components/Breadcrumbs";
import { Avatar, Container, Group, SimpleGrid, Title } from "@mantine/core";
import { CurrentTimeout } from "~/components/users/CurrentTimeout";
import {
  DBGuildMemberPunishmentsRAW,
  getDBGuildMemberPunishmentsRAW,
} from "~/models/dbGuildMember.server";
import { PluginCard } from "~/components/PluginCard";
import { ClipboardCheckIcon, UserAddIcon } from "@heroicons/react/solid";

import { discordAvatar, error } from "~/utils";
import errors from "~/errors.json";
import { ThemeChip } from "~/components/ThemeChip";
import { DoubleNavbar } from "~/components/Navbar";

type LoaderData = {
  dbGuild: DBGuild;
  apiGuild: APIGuild;
  apiGuildMember: APIGuildMember;
  dbGuildMemberPunishmentsRAW: DBGuildMemberPunishmentsRAW;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const uri = session.get("uuid");

  error(params.guild, `params.guild is required`, 400);
  error(uri, `session is required`, 400);
  error(params.member, `params.member is required`, 400);

  const [dbGuild, apiGuild, apiGuildMember, dbGuildMemberPunishmentsRAW] =
    await Promise.all([
      getDBGuild(params.guild, uri),
      getAPIGuild(params.guild, uri),
      getAPIGuildMember(params.guild, uri, params.member),
      getDBGuildMemberPunishmentsRAW(params.guild, params.member, true),
    ]);

  error(apiGuild.completed, errors.GET_API_GUILD_FAIL, 401);

  if (!apiGuildMember.completed)
    return redirect(`/${params.guild}/user-lookup/${params.member}`);

  return json<LoaderData>({
    dbGuild,
    apiGuild: apiGuild.result!,
    apiGuildMember: apiGuildMember.result!,
    dbGuildMemberPunishmentsRAW,
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

  if (data.get("ban") === "true") {
    const id = data.get("user_id")?.toString();
    const reason = data.get("reason")?.toString();
    error(id, "id is required", 400, true);

    const result = await banAPIGuildMember(
      params.guild,
      uri,
      id,
      reason ?? "No reason specified"
    );
    error(result.result, result.message, 500, true);
    return redirect(`/${params.guild}/users`);
  }
  if (data.get("kick") === "true") {
    const id = data.get("user_id")?.toString();
    const reason = data.get("reason")?.toString();
    error(id, "id is required", 400, true);

    const result = await kickAPIGuildMember(
      params.guild,
      uri,
      id,
      reason ?? "No reason specified"
    );
    error(result.result, result.message, 500, true);
    return redirect(`/${params.guild}/users`);
  }
  if (data.get("timeout") === "true") {
    const id = data.get("user_id")?.toString();
    const reason = data.get("reason")?.toString();
    const time = data.get("time")?.toString();
    error(id, "id is required", 400, true);
    error(time, "time is required", 400, true);

    const result = await timeoutAPIGuildMember(
      params.guild,
      uri,
      id,
      reason ?? "No reason specified",
      time
    );
    error(result.result, result.message, 500, true);
  }
  if (data.get("remove_timeout") === "true") {
    const id = data.get("user_id")?.toString();
    error(id, "id is required", 400, true);

    const result = await removeTimeoutAPIGuildMember(params.guild, uri, id);
    error(result.result, result.message, 500, true);
  }
  return "OK";
};

export default function Index() {
  const { apiGuildMember, apiGuild } = useLoaderData() as LoaderData;

  const params = useParams();

  const navigateURL = (path: string) => `/${params.guild}/${path}`;
  const navigateUserURL = (id: string) => `/${params.guild}/users/${id}`;
  const navigatePluginURL = (path: string) =>
    `/${params.guild}/users/${params.member}/${path}`;

  return (
    <DoubleNavbar>
      <Breadcrumbs
        items={[
          {
            title: "Users",
            href: navigateURL("users"),
          },
          {
            title: apiGuildMember.user!.username,
            href: navigateUserURL(params.member!),
          },
        ]}
      />
      <Group>
        <Avatar
          radius="xl"
          src={discordAvatar(
            apiGuildMember.user!.id,
            apiGuildMember.user!.avatar
          )}
        />

        <Title order={1}>{apiGuildMember.user!.username}</Title>

        {apiGuild.owner_id === apiGuildMember.user!.id && (
          <ThemeChip text="OWNER" color="indigo" />
        )}
      </Group>
      <SimpleGrid
        cols={3}
        breakpoints={[
          { maxWidth: "xl", cols: 2, spacing: "sm" },
          { maxWidth: "md", cols: 1, spacing: "sm" },
        ]}
        pt="md"
      >
        <PluginCard
          title={"Punishment History"}
          link={navigatePluginURL("punishment-history")}
          Icon={ClipboardCheckIcon}
          description={"Review and delete recent punishments"}
        />
        <PluginCard
          title={"Invite History"}
          link={navigatePluginURL("invite-history")}
          Icon={UserAddIcon}
          description={"Review and delete invites from users"}
        />
      </SimpleGrid>

      <SimpleGrid
        breakpoints={[
          { maxWidth: "md", cols: 3, spacing: "sm" },
          { maxWidth: "sm", cols: 2, spacing: "sm" },
          { maxWidth: "xs", cols: 1, spacing: "sm" },
        ]}
        cols={4}
        pt="md"
      >
        <CurrentTimeout member={apiGuildMember} />
        <PunishmentButtons />
      </SimpleGrid>
    </DoubleNavbar>
  );
}
