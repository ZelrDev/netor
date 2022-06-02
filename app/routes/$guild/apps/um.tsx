import { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, useLocation, useParams } from "@remix-run/react";
import {
  getDBGuild,
  toggleRTM,
  toggleUM,
  updateRTMChannel,
  updateUMLeaveChannel,
  updateUMLeaveMessage,
  updateUMLeaveMessageRAW,
  updateUMWelcomeChannel,
  updateUMWelcomeMessage,
  updateUMWelcomeMessageRAW,
} from "~/models/dbGuild.server";
import type { DBGuild } from "~/models/dbGuild.server";
import { useEffect, useState } from "react";
import type { APIGuild } from "~/requests/apiGuild.server";
import { getAPIGuild } from "~/requests/apiGuild.server";
import { getAPIGuildChannels } from "~/requests/apiGuildChannels.server";
import type { APIGuildChannels } from "~/requests/apiGuildChannels.server";
import { getSession } from "~/sessions";
import {
  Alert,
  Autocomplete,
  Container,
  Group,
  Stack,
  Switch,
  Title,
} from "@mantine/core";
import { ExclamationCircleIcon, HashtagIcon } from "@heroicons/react/solid";
import { Breadcrumbs } from "~/components/Breadcrumbs";
import { cleanUpMessage, error } from "~/utils";
import errors from "~/errors.json";
import { DoubleNavbar } from "~/components/Navbar";
import { tags, UM } from "~/components/apps/UM";

type LoaderData = {
  dbGuild: DBGuild;
  apiGuild: APIGuild;
  apiGuildChannels: APIGuildChannels;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const uri = session.get("uuid");

  error(params.guild, `params.guild is required`, 400);
  error(uri, `session is required`, 400);

  const [dbGuild, apiGuild, apiGuildChannels] = await Promise.all([
    getDBGuild(params.guild, uri),
    getAPIGuild(params.guild, uri),
    getAPIGuildChannels(params.guild, uri),
  ]);

  return json<LoaderData>({
    apiGuild: apiGuild.result!,
    apiGuildChannels: apiGuildChannels.result!,
    dbGuild,
  });
};

export const action: ActionFunction = async ({ request, params }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const uri = session.get("uuid");

  error(params.guild, `params.guild is required`, 400, true);
  error(uri, `session is required`, 400, true);

  const data = await request.formData();

  const [dbGuild] = await Promise.all([getDBGuild(params.guild, uri, true)]);

  if (data.get("enabled") === "true" && !dbGuild.um_enabled)
    toggleUM(params.guild, true, true);
  if (data.get("enabled") === "false" && dbGuild.um_enabled)
    toggleUM(params.guild, false, true);

  if (
    data.get("welcome_channel") &&
    data.get("welcome_channel") !== dbGuild.um_welcome_channel_id
  )
    updateUMWelcomeChannel(
      params.guild,
      data.get("welcome_channel")?.toString() ?? "",
      true
    );

  if (
    data.get("leave_channel") &&
    data.get("leave_channel") !== dbGuild.um_welcome_channel_id
  )
    updateUMLeaveChannel(
      params.guild,
      data.get("leave_channel")?.toString() ?? "",
      true
    );

  if (
    data.get("welcome_msg") &&
    data.get("welcome_msg") !== dbGuild.um_welcome_msg
  ) {
    updateUMWelcomeMessage(
      params.guild,
      cleanUpMessage(data.get("welcome_msg")?.toString() ?? "", tags),
      true
    );
    updateUMWelcomeMessageRAW(
      params.guild,
      data.get("welcome_msg")?.toString() ?? "",
      true
    );
  }

  if (
    data.get("leave_msg") &&
    data.get("leave_msg") !== dbGuild.um_welcome_channel_id
  ) {
    updateUMLeaveMessage(
      params.guild,
      cleanUpMessage(data.get("leave_msg")?.toString() ?? "", tags),
      true
    );
    updateUMLeaveMessageRAW(
      params.guild,
      data.get("leave_msg")?.toString() ?? "",
      true
    );
  }

  return "OK";
};

export default function Index() {
  const { dbGuild, apiGuildChannels } = useLoaderData() as LoaderData;
  const [checked, setChecked] = useState<boolean>(false);
  const [ready, setReady] = useState<boolean>(false);
  const { pathname } = useLocation();
  const params = useParams();
  const navigateURL = (path: string) => `/${params.guild}/${path}`;

  useEffect(() => {
    if (dbGuild.um_enabled) setChecked(true);
    // wait for checked to be fully set to true so it doesnt trigger a post request
    setTimeout(() => setReady(true), 250);
  }, []);

  useEffect(() => {
    if (ready) {
      let formData = new FormData();
      formData.append("enabled", checked!.toString());

      fetch(pathname, {
        body: formData,
        method: "post",
      });
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
            title: "User Messages",
            href: navigateURL("apps/um"),
          },
        ]}
      />
      <Title order={1}>User Messages</Title>
      <Stack spacing="md" pt="md">
        <Switch
          checked={checked}
          onChange={(event) => setChecked(event.currentTarget.checked)}
          label="Enabled"
        />
        <Alert
          icon={<ExclamationCircleIcon height={16} />}
          color="yellow"
          children="Channels may take up to 1 minute to refresh courtesy of caching"
        />
        <Stack spacing="xl">
          <UM type="WELCOME" />
          <UM type="LEAVE" />
        </Stack>
      </Stack>
    </DoubleNavbar>
  );
}
