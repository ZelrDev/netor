import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { getSession } from "~/modules/auth/sessions.server";
import { UserTable } from "~/modules/guild/users/UserListTable";
import {
  getAPIGuildBannedMembers,
  getAPIGuildMembers,
} from "~/api-requests/apiGuildMembers.server";
import type {
  APIGuildMembers,
  APIGuildBannedMembers,
} from "~/api-requests/apiGuildMembers.server";
import type { APIGuildRoles } from "~/api-requests/apiGuildRoles.server";
import { getAPIGuildRoles } from "~/api-requests/apiGuildRoles.server";
import { Alert, Title } from "@mantine/core";
import { ExclamationCircleIcon } from "@heroicons/react/solid";
import { error } from "~/utils";
import errors from "~/errors.json";
import { useData } from "~/shared-hooks/use-data";
import type { LoaderData } from "~/routes/$guild";
import { useTypeSafeTranslation } from "~/shared-hooks/use-type-safe-translation";
import i18n from "~/i18next.server";

type RouteLoaderData = {
  apiGuildMembers: APIGuildMembers;
  apiGuildBannedMembers: APIGuildBannedMembers;
  apiGuildRoles: APIGuildRoles;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  let t = await i18n.getFixedT(request);

  const session = await getSession(request.headers.get("Cookie"));
  const uri = session.get("uuid");

  error(params.guild, `params.guild is required`, 400);
  error(uri, `session is required`, 400);

  const [apiGuildRoles, apiGuildBannedMembers, apiGuildMembers] =
    await Promise.all([
      getAPIGuildRoles(params.guild, uri),
      getAPIGuildBannedMembers(params.guild, uri),
      getAPIGuildMembers(params.guild, uri),
    ]);

  error(apiGuildRoles.completed, t("errors.getAPIGuildFail"), 401);
  error(apiGuildBannedMembers.completed, t("errors.getAPIGuildFail"), 401);
  error(apiGuildMembers.completed, t("errors.getAPIGuildFail"), 401);

  return json<RouteLoaderData>({
    apiGuildMembers: apiGuildMembers.result!,
    apiGuildBannedMembers: apiGuildBannedMembers.result!,
    apiGuildRoles: apiGuildRoles.result!,
  });
};

export default function Index() {
  const { t } = useTypeSafeTranslation();
  const { apiGuildMembers, apiGuildRoles, apiGuild, apiGuildBannedMembers } =
    useData() as LoaderData<RouteLoaderData>;

  return (
    <>
      <Title pb="md" order={1}>
        {t("links.users")}
      </Title>
      <Alert
        icon={<ExclamationCircleIcon width={16} />}
        color="yellow"
        radius="xs"
        mb="md"
      >
        TODO: add i18n Due to caching it may take up to 1 minute to update this
        list
      </Alert>
      <Alert
        icon={<ExclamationCircleIcon width={16} />}
        color="yellow"
        radius="xs"
        mb="md"
      >
        TODO: add i18n Results are limited to 1000 due to Discord. To find a
        user right click them in Discord and select "Apps {">"} View User".
      </Alert>
      <UserTable
        guild={apiGuild}
        bannedUsers={apiGuildBannedMembers}
        users={apiGuildMembers}
        roles={apiGuildRoles}
      />
    </>
  );
}
