import { Title } from "@mantine/core";
import { useLoaderData, useOutletContext, useParams } from "@remix-run/react";
import { Breadcrumbs } from "~/ui/Breadcrumbs";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { DBGuildEmbeds } from "~/models/dbGuild.server";
import { getDBGuildEmbeds } from "~/models/dbGuild.server";
import { getSession } from "~/modules/auth/sessions.server";
import { error } from "~/utils";
import { EmbedCreator } from "~/modules/guild/embed/EmbedCreator";
import type { LoaderData } from "../../apps";
import { useData } from "~/shared-hooks/use-data";
import { useTypeSafeTranslation } from "~/shared-hooks/use-type-safe-translation";

type RouteLoaderData = {
  dbGuildEmbeds: DBGuildEmbeds;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const uri = session.get("uuid");

  error(params.guild, `params.guild is required`, 400);
  error(uri, `session is required`, 400);

  const [dbGuildEmbeds] = await Promise.all([
    getDBGuildEmbeds(params.guild, uri),
  ]);

  return json<RouteLoaderData>({
    dbGuildEmbeds,
  });
};

export default function Index() {
  const params = useParams();
  const data = useData() as LoaderData<RouteLoaderData>;
  const navigateURL = (path: string) => `/${params.guild}/${path}`;
  const { t } = useTypeSafeTranslation();

  return (
    <>
      <Breadcrumbs
        items={[
          {
            title: t("modules.embedGenerator.name"),
            href: navigateURL("apps/embed-generator"),
          },
          {
            title: t("modules.embedGenerator.createTemplate"),
            href: navigateURL("apps/embed-generator/create"),
          },
        ]}
      />
      <Title order={2}>{t("modules.embedGenerator.createTemplate")}</Title>
      <EmbedCreator {...data} />
    </>
  );
}
