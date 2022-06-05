import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useParams } from "@remix-run/react";
import {
  createDBEmbed,
  getDBGuild,
  getDBGuildEmbeds,
  validateSessionURI,
} from "~/models/dbGuild.server";
import type { DBGuild, DBGuildEmbeds } from "~/models/dbGuild.server";
import type { APIGuild } from "~/requests/apiGuild.server";
import { getAPIGuild } from "~/requests/apiGuild.server";
import { getSession } from "~/sessions";
import { Title } from "@mantine/core";
import { Breadcrumbs } from "~/components/Breadcrumbs";
import { EmbedCreator } from "~/components/apps/EmbedCreator";
import type DiscordEmbed from "types/DiscordEmbed";
import { error } from "~/utils";
import errors from "~/errors.json";
import { DoubleNavbar } from "~/components/Navbar";
import { redirect } from "@remix-run/server-runtime";

type LoaderData = {
  dbGuild: DBGuild;
  dbGuildEmbeds: DBGuildEmbeds;
  apiGuild: APIGuild;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const uri = session.get("uuid");

  error(params.guild, `params.guild is required`, 400);
  error(uri, `session is required`, 400);

  const [dbGuild, dbGuildEmbeds, apiGuild] = await Promise.all([
    getDBGuild(params.guild, uri),
    getDBGuildEmbeds(params.guild, uri),
    getAPIGuild(params.guild, uri),
  ]);

  error(apiGuild.completed, errors.GET_API_GUILD_FAIL, 401);

  return json<LoaderData>({
    apiGuild: apiGuild.result!,
    dbGuild,
    dbGuildEmbeds,
  });
};

export const action: ActionFunction = async ({ request, params }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const uri = session.get("uuid");

  error(params.guild, `params.guild is required`, 400, true);
  error(uri, `session is required`, 400, true);
  const data = await request.formData();

  const valid = await validateSessionURI(params.guild, uri, true);
  error(valid, errors.VALIDATE_DB_GUILD_FAIL, 401, true);

  if (data.get("embed")) {
    const embed: DiscordEmbed = JSON.parse(data.get("embed")!.toString());
    await createDBEmbed(params.guild, embed, true);
  }
  return redirect(`/${params.guild}/apps/embed-generator`);
};

export default function Index() {
  const params = useParams();
  const navigateURL = (path: string) => `/${params.guild}/${path}`;

  return (
    <DoubleNavbar>
      <Breadcrumbs
        items={[
          {
            title: "Apps",
          },
          {
            title: "Embed Generator",
            href: navigateURL("apps/embed-generator"),
          },
          {
            title: "Create",
            href: navigateURL("apps/embed-generator"),
          },
        ]}
      />
      <Title order={1}>Create Embed</Title>
      <EmbedCreator />
    </DoubleNavbar>
  );
}
