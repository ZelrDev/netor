import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { getDBGuildEmbeds } from "~/models/dbGuild.server";
import type { DBGuildEmbeds } from "~/models/dbGuild.server";
import { getSession } from "~/modules/auth/sessions.server";
import { Title, Button } from "@mantine/core";
import { Link } from "@remix-run/react";
import { EmbedSend } from "~/modules/guild/embed/EmbedListSend";
import type { LoaderData } from "../../apps";
import { useData } from "~/shared-hooks/use-data";
import { useTypeSafeTranslation } from "~/shared-hooks/use-type-safe-translation";
import { useState } from "react";
import CreateIndex from "./create";
import { error } from "~/lib/error";
import { customMeta } from "~/meta";
export const meta: MetaFunction = customMeta({
  title: "Embeds | Netor",
});

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

export default function Index(props: { futureUI?: { data: any } }) {
  let data = useData() as LoaderData<RouteLoaderData>;
  if (props.futureUI) data = props.futureUI.data as LoaderData<RouteLoaderData>;
  const [futureUI, setFutureUI] = useState<any>();
  const { t } = useTypeSafeTranslation();

  return futureUI ? (
    futureUI
  ) : (
    <>
      <Title order={2}>{t("modules.embedGenerator.name")}</Title>

      <Link to="create">
        <Button onClick={() => setFutureUI(<CreateIndex />)} mt="lg">
          {t("modules.embedGenerator.createTemplate")}
        </Button>
      </Link>
      <EmbedSend {...data} />
    </>
  );
}
