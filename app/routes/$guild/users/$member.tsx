import { Outlet } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/server-runtime";
import { redirect } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { getSession } from "~/modules/auth/sessions.server";
import { discordAvatar, error } from "~/utils";
import { useData } from "~/shared-hooks/use-data";
import type { LoaderData as GuildLoaderData } from "../../$guild";
import { AppsNavbar } from "~/ui/RoutesNavbar";
import { getAPIGuildMember } from "~/api-requests/apiGuildMember.server";
import type { APIGuildMember } from "~/api-requests/apiGuildMember.server";
import type { APIUser } from "~/api-requests/apiUser.server";
import { getAPIUser } from "~/api-requests/apiUser.server";
import errors from "~/errors.json";
import {
  ClipboardCheckIcon,
  CollectionIcon,
  UserAddIcon,
} from "@heroicons/react/solid";
import { Stack } from "@mantine/core";
import { useGenericDiscordUser } from "~/shared-hooks/use-generic-discord-user";
import { DiscordUserTitle } from "~/ui/DiscordUserTitle";
import { useTypeSafeTranslation } from "~/shared-hooks/use-type-safe-translation";
import i18n from "~/i18next.server";

type RouteLoaderData = {
  apiGuildMember?: APIGuildMember;
  apiUser?: APIUser;
};

export type LoaderData<T = {}> = T & GuildLoaderData & RouteLoaderData;

export const loader: LoaderFunction = async ({ request, params }) => {
  let t = await i18n.getFixedT(request);

  const session = await getSession(request.headers.get("Cookie"));
  const uri = session.get("uuid");

  error(params.guild, `params.guild is required`, 400);
  error(uri, `session is required`, 400);
  error(params.member, `params.member is required`, 400);

  const [apiGuildMember] = await Promise.all([
    getAPIGuildMember(params.guild, uri, params.member),
  ]);
  let apiUser;

  if (!apiGuildMember.completed) {
    apiUser = await getAPIUser(params.guild, params.member, uri);
    error(apiUser.completed, t("errors.getAPIUserFail"), 404);
  }

  return json<RouteLoaderData>({
    apiGuildMember: apiGuildMember.result,
    apiUser: apiUser?.result,
  });
};

export default function Apps() {
  const data = useData();
  const user = useGenericDiscordUser(data.apiUser ?? data.apiGuildMember)!;
  const { t } = useTypeSafeTranslation();

  const routes = [
    {
      label: t("pages.user.navigation.overview"),
      href: "overview",
      icon: CollectionIcon,
    },
    {
      label: t("pages.user.navigation.punishmentHistory"),
      href: "punishment-history",
      icon: ClipboardCheckIcon,
    },
    {
      label: t("pages.user.navigation.inviteHistory"),
      href: "invite-history",
      icon: UserAddIcon,
    },
  ];

  return (
    <Stack spacing="xl">
      <DiscordUserTitle
        owner={data.apiGuild.owner_id === user.id}
        id={user.id}
        avatarHash={user.avatar}
        username={user.username}
      />
      <AppsNavbar routes={routes}>
        <Outlet context={data} />
      </AppsNavbar>
    </Stack>
  );
}
