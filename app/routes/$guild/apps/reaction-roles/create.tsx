import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useParams } from "@remix-run/react";
import { getDBGuildEmbeds } from "~/models/dbGuild.server";
import type { DBGuildEmbeds } from "~/models/dbGuild.server";
import { getSession } from "~/modules/auth/sessions.server";
import { Title } from "@mantine/core";
import { Breadcrumbs } from "~/ui/Breadcrumbs";
import { ReactionRoleCreator } from "~/modules/guild/reaction-role/ReactionRoleCreator";
import { getAPIGuildRoles } from "~/api-requests/apiGuildRoles.server";
import type { APIGuildRoles } from "~/api-requests/apiGuildRoles.server";
import { useData } from "~/shared-hooks/use-data";
import type { LoaderData } from "../../apps";
import i18n from "~/i18next.server";
import { useTypeSafeTranslation } from "~/shared-hooks/use-type-safe-translation";
import { error } from "~/lib/error";

export const meta: MetaFunction = () => ({
  title: "Create Reaction Role | Netor",
});

type RouteLoaderData = {
  dbGuildEmbeds: DBGuildEmbeds;
  apiGuildRoles: APIGuildRoles;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  let t = await i18n.getFixedT(request);

  const session = await getSession(request.headers.get("Cookie"));
  const uri = session.get("uuid");

  error(params.guild, `params.guild is required`, 400);
  error(uri, `session is required`, 400);

  const [dbGuildEmbeds, apiGuildRoles] = await Promise.all([
    getDBGuildEmbeds(params.guild, uri),
    getAPIGuildRoles(params.guild, uri),
  ]);

  error(apiGuildRoles.completed, t("errors.getAPIGuildRolesFail"), 401);

  return json<RouteLoaderData>({
    dbGuildEmbeds,
    apiGuildRoles: apiGuildRoles.result!,
  });
};

export default function Index() {
  const params = useParams();
  const { dbGuildEmbeds, apiGuildRoles } =
    useData() as LoaderData<RouteLoaderData>;
  const navigateURL = (path: string) => `/${params.guild}/${path}`;
  const { t } = useTypeSafeTranslation();

  return (
    <>
      <Breadcrumbs
        items={[
          {
            title: t("modules.reactionRoles.name"),
            href: navigateURL("apps/reaction-roles"),
          },
          {
            title: t("modules.reactionRoles.createTemplate"),
            href: navigateURL("apps/reaction-roles/create"),
          },
        ]}
      />
      <Title order={2}>{t("modules.reactionRoles.createTemplate")}</Title>
      <ReactionRoleCreator
        dbGuildEmbeds={dbGuildEmbeds}
        apiGuildRoles={apiGuildRoles}
      />
    </>
  );
}
