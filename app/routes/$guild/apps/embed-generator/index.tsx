import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { getDBGuildEmbeds } from "~/models/dbGuild.server";
import type { DBGuildEmbeds } from "~/models/dbGuild.server";
import { getSession } from "~/modules/auth/sessions.server";
import { error } from "~/utils";
import { Title, Button } from "@mantine/core";
import {
  useParams,
  Link,
  useLoaderData,
  useOutletContext,
} from "@remix-run/react";
import { Breadcrumbs } from "~/ui/Breadcrumbs";
import { EmbedSend } from "~/modules/guild/embed/EmbedListSend";
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
  const data = useData() as LoaderData<RouteLoaderData>;
  const { t } = useTypeSafeTranslation();

  return (
    <>
      <Title order={2}>{t("modules.embedGenerator.name")}</Title>

      <Link to="create">
        <Button mt="lg">{t("modules.embedGenerator.createTemplate")}</Button>
      </Link>
      <EmbedSend {...data} />
    </>
  );
}
