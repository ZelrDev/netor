import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getDBGuild } from "~/models/dbGuild.server";
import { getAPIGuild } from "~/requests/apiGuild.server";
import type { DBGuild } from "~/models/dbGuild.server";
import type { APIGuild } from "~/requests/apiGuild.server";
import { getSession } from "~/sessions";
import { UserTable } from "~/components/users/UserTable";
import {
  APIGuildBannedMembers,
  getAPIGuildBannedMembers,
  getAPIGuildMembers,
} from "~/requests/apiGuildMembers.server";
import type { APIGuildMembers } from "~/requests/apiGuildMembers.server";
import type { APIGuildRoles } from "~/requests/apiGuildRoles.server";
import { getAPIGuildRoles } from "~/requests/apiGuildRoles.server";
import { HeaderSimple } from "~/components/Header";
import { Alert, Container, Title } from "@mantine/core";
import { ExclamationCircleIcon } from "@heroicons/react/solid";
import { error } from "~/utils";
import errors from "~/errors.json";
import { DoubleNavbar } from "~/components/Navbar";

type LoaderData = {
  dbGuild: DBGuild;
  apiGuild: APIGuild;
  apiGuildMembers: APIGuildMembers;
  apiGuildBannedMembers: APIGuildBannedMembers;
  apiGuildRoles: APIGuildRoles;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const uri = session.get("uuid");

  error(params.guild, `params.guild is required`, 400);
  error(uri, `session is required`, 400);

  const [
    dbGuild,
    apiGuild,
    apiGuildRoles,
    apiGuildBannedMembers,
    apiGuildMembers,
  ] = await Promise.all([
    getDBGuild(params.guild, uri),
    getAPIGuild(params.guild, uri),
    getAPIGuildRoles(params.guild, uri),
    getAPIGuildBannedMembers(params.guild, uri),
    getAPIGuildMembers(params.guild, uri),
  ]);

  error(apiGuildRoles.completed, errors.GET_API_GUILD_FAIL, 401);
  error(apiGuildBannedMembers.completed, errors.GET_API_GUILD_FAIL, 401);
  error(apiGuildMembers.completed, errors.GET_API_GUILD_FAIL, 401);

  return json<LoaderData>({
    dbGuild,
    apiGuild: apiGuild.result!,
    apiGuildMembers: apiGuildMembers.result!,
    apiGuildBannedMembers: apiGuildBannedMembers.result!,
    apiGuildRoles: apiGuildRoles.result!,
  });
};

export default function Index() {
  const { apiGuildMembers, apiGuildRoles, apiGuild, apiGuildBannedMembers } =
    useLoaderData() as LoaderData;

  return (
    <DoubleNavbar>
      <Title pb="md" order={1}>
        Users
      </Title>
      <Alert
        icon={<ExclamationCircleIcon width={16} />}
        color="yellow"
        radius="xs"
        mb="md"
      >
        Results are limited to 1000 due to Discord. To find a user right click
        them in Discord and select "Apps {">"} View User".
      </Alert>
      <UserTable
        guild={apiGuild}
        bannedUsers={apiGuildBannedMembers}
        users={apiGuildMembers}
        roles={apiGuildRoles}
      />
    </DoubleNavbar>
  );
}
