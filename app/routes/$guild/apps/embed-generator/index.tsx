import { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Link,
  useLoaderData,
  useLocation,
  useParams,
  useSubmit,
} from "@remix-run/react";
import {
  DBGuildEmbeds,
  deleteDBEmbed,
  getDBGuild,
  getDBGuildEmbeds,
  validateSessionURI,
} from "~/models/dbGuild.server";
import type { DBGuild } from "~/models/dbGuild.server";
import { useEffect, useState } from "react";
import type { APIGuild } from "~/requests/apiGuild.server";
import { getAPIGuild } from "~/requests/apiGuild.server";
import { getAPIGuildChannels } from "~/requests/apiGuildChannels.server";
import type { APIGuildChannels } from "~/requests/apiGuildChannels.server";
import { getSession } from "~/sessions";
import { HeaderSimple } from "~/components/Header";
import { Alert, Button, Container, Title } from "@mantine/core";
import { Breadcrumbs } from "~/components/Breadcrumbs";
import { EmbedList } from "~/components/apps/EmbedList";
import { sendMessageEmbed } from "~/requests/apiGuildMessages.server";
import DiscordEmbed from "types/DiscordEmbed";
import { error } from "~/utils";
import errors from "~/errors.json";
import { DoubleNavbar } from "~/components/Navbar";
import { ExclamationCircleIcon } from "@heroicons/react/solid";

type LoaderData = {
  dbGuild: DBGuild;
  dbGuildEmbeds: DBGuildEmbeds;
  apiGuild: APIGuild;
  apiGuildChannels: APIGuildChannels;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const uri = session.get("uuid");

  error(params.guild, `params.guild is required`, 400);
  error(uri, `session is required`, 400);

  const [dbGuild, dbGuildEmbeds, apiGuild, apiGuildChannels] =
    await Promise.all([
      getDBGuild(params.guild, uri),
      getDBGuildEmbeds(params.guild, uri),
      getAPIGuild(params.guild, uri),
      getAPIGuildChannels(params.guild, uri),
    ]);

  error(apiGuild.completed, errors.GET_API_GUILD_FAIL, 400);
  error(apiGuildChannels.completed, errors.GET_API_GUILD_FAIL, 400);

  return json<LoaderData>({
    apiGuild: apiGuild.result!,
    apiGuildChannels: apiGuildChannels.result!,
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

  const validate = await validateSessionURI(params.guild, uri, true);
  error(validate, errors.VALIDATE_DB_GUILD_FAIL, 400, true);

  if (data.get("send_embed") === "true") {
    error(data.get("embed"), `embed is required`, 400, true);
    const embed: DiscordEmbed = JSON.parse(data.get("embed")!.toString());

    const channelId = data.get("channel_id");
    error(channelId, `channel_id is required`, 400, true);

    const result = await sendMessageEmbed(
      params.guild,
      uri,
      channelId.toString(),
      embed
    );
    error(result.result, result.message, 500, true);
  }
  if (data.get("delete_embed") === "true") {
    const embedId = data.get("embed_id");
    error(embedId, `embed_id is required`, 400, true);
    await deleteDBEmbed(parseInt(embedId!.toString()), true);
  }

  return "OK";
};

export default function Index() {
  const { dbGuild, dbGuildEmbeds } = useLoaderData() as LoaderData;
  const [checked, setChecked] = useState<boolean>(false);
  const [ready, setReady] = useState<boolean>(false);
  const submit = useSubmit();
  const params = useParams();

  const navigateURL = (path: string) => `/${params.guild}/${path}`;

  useEffect(() => {
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) {
      let formData = new FormData();
      formData.append("enabled", checked!.toString());
      submit(formData, { method: "post" });
    }
  }, [checked]);

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
        ]}
      />
      <Title order={1}>Embed Generator</Title>

      <Link to="create">
        <Button mt="lg">Create Embed Template</Button>
      </Link>
      <EmbedList embeds={dbGuildEmbeds} />
      <Alert
        icon={<ExclamationCircleIcon height={16} />}
        color="yellow"
        children="Channels may take up to 1 minute to refresh courtesy of caching"
      />
    </DoubleNavbar>
  );
}
