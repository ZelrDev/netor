import { Title } from "@mantine/core";
import { useLocation, useParams } from "@remix-run/react";
import { Breadcrumbs } from "~/ui/Breadcrumbs";
import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import type { DBGuildEmbeds } from "~/models/dbGuild.server";
import { getDBGuildEmbeds } from "~/models/dbGuild.server";
import { getSession } from "~/modules/auth/sessions.server";
import { EmbedCreator } from "~/modules/guild/embed/EmbedCreator";
import type { LoaderData } from "../../apps";
import { useData } from "~/shared-hooks/use-data";
import { useTypeSafeTranslation } from "~/shared-hooks/use-type-safe-translation";
import { useContext, useState } from "react";
import ListIndex from "./index";
import { PathnameContext } from "~/contexts/Pathname";
import { error } from "~/lib/error";
import { convertDiscordEmbedToDBEmbed } from "~/lib/convertDiscordEmbedToDBEmbed";

type RouteLoaderData = {
  dbGuildEmbeds: DBGuildEmbeds;
};

export const meta: MetaFunction = () => ({
  title: "Create Embed | Netor",
});

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
  const { setPathname } = useContext(PathnameContext);
  const { pathname } = useLocation();
  const [futureUI, setFutureUI] = useState<any>();
  const data = useData() as LoaderData<RouteLoaderData>;
  const navigateURL = (path: string) => `/${params.guild}/${path}`;
  const { t } = useTypeSafeTranslation();
  if (futureUI) return futureUI;

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
      <EmbedCreator
        onCreate={(embed) => {
          const fakePath = pathname.replace("/create", "");
          window.history.pushState("", "", fakePath);
          setPathname(fakePath);
          data.dbGuildEmbeds.push(
            convertDiscordEmbedToDBEmbed(data.apiGuild.id, embed)
          );
          setFutureUI(
            <ListIndex
              futureUI={{
                data,
              }}
            />
          );
        }}
        {...data}
      />
    </>
  );
}
