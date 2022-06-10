import { Outlet } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { getSession } from "~/modules/auth/sessions.server";
import { error } from "~/utils";
import errors from "~/errors.json";
import { getAPIGuildChannels } from "~/api-requests/apiGuildChannels.server";
import type { APIGuildChannels } from "~/api-requests/apiGuildChannels.server";
import { useData } from "~/shared-hooks/use-data";
import type { LoaderData as GuildLoaderData } from "../$guild";
import { AppsNavbar } from "~/ui/RoutesNavbar";
import {
  ShieldCheckIcon,
  ChatAlt2Icon,
  UserGroupIcon,
  ChatIcon,
} from "@heroicons/react/solid";
import { useTypeSafeTranslation } from "~/shared-hooks/use-type-safe-translation";
import i18n from "~/i18next.server";

type RouteLoaderData = {
  apiGuildChannels: APIGuildChannels;
};

export type LoaderData<T = {}> = T & GuildLoaderData & RouteLoaderData;

export const loader: LoaderFunction = async ({ request, params }) => {
  let t = await i18n.getFixedT(request);

  const session = await getSession(request.headers.get("Cookie"));
  const uri = session.get("uuid");

  error(params.guild, `params.guild is required`, 400);
  error(uri, `session is required`, 400);

  const [apiGuildChannels] = await Promise.all([
    getAPIGuildChannels(params.guild, uri),
  ]);
  error(apiGuildChannels.completed, t("errors.getAPIGuildFail"), 400);

  return json<RouteLoaderData>({
    apiGuildChannels: apiGuildChannels.result!,
  });
};

export default function Apps() {
  const data = useData();
  const { t } = useTypeSafeTranslation();
  const routes = [
    {
      label: t("modules.reportToModerators.name"),
      href: "report-to-moderators",
      icon: ShieldCheckIcon,
    },
    {
      label: t("modules.embedGenerator.name"),
      href: "embed-generator",
      icon: ChatAlt2Icon,
    },
    // {
    //   label: t("modules.reactionRoles.name"),
    //   href: "reaction-roles",
    //   icon: UserGroupIcon,
    // },
    {
      label: t("modules.userMessages.name"),
      href: "user-messages",
      icon: ChatIcon,
    },
  ];
  return (
    <>
      <AppsNavbar routes={routes}>
        <Outlet context={data} />
      </AppsNavbar>
    </>
  );
}
