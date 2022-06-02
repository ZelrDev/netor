import { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, useLocation, useParams } from "@remix-run/react";
import {
  getDBGuild,
  toggleRTM,
  updateRTMChannel,
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
  Stack,
  Switch,
  Title,
} from "@mantine/core";
import { ExclamationCircleIcon, HashtagIcon } from "@heroicons/react/solid";
import { Breadcrumbs } from "~/components/Breadcrumbs";
import { error } from "~/utils";
import errors from "~/errors.json";
import { DoubleNavbar } from "~/components/Navbar";

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

  const dbGuild = await getDBGuild(params.guild, uri, true);

  if (data.get("enabled") === "true" && !dbGuild.rtm_enabled)
    toggleRTM(params.guild, true, true);
  if (data.get("enabled") === "false" && dbGuild.rtm_enabled)
    toggleRTM(params.guild, false, true);

  if (data.get("channel") !== dbGuild.rtm_channel_id) {
    updateRTMChannel(params.guild, data.get("channel")?.toString() ?? "", true);
  }

  return "OK";
};

const filterChannels = (channels: APIGuildChannels) =>
  channels.filter((channel) => channel.type === 0);

export default function Index() {
  const { dbGuild, apiGuildChannels } = useLoaderData() as LoaderData;
  const [selectedData, setSelectedData] = useState<{
    id: string;
    value: string;
  }>();
  const [checked, setChecked] = useState<boolean>(false);
  const [localAutocompleteValue, setLocalAutocompleteValue] = useState(
    selectedData?.value
  );
  const [ready, setReady] = useState<boolean>(false);
  const { pathname } = useLocation();
  const params = useParams();

  const navigateURL = (path: string) => `/${params.guild}/${path}`;

  useEffect(() => {
    setLocalAutocompleteValue(selectedData?.value);
  }, [selectedData]);

  useEffect(() => {
    const channel = apiGuildChannels.filter(
      (channel) => channel.id === dbGuild.rtm_channel_id
    );
    if (channel.length === 1) {
      setSelectedData({
        id: channel[0].id!,
        value: channel[0].name!,
      });
    }
    if (dbGuild.rtm_enabled) setChecked(true);
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) {
      let formData = new FormData();
      formData.append("enabled", checked!.toString());
      formData.append("channel", selectedData?.id!.toString() ?? "");

      fetch(pathname, {
        body: formData,
        method: "post",
      });
    }
  }, [selectedData, checked]);

  return (
    <DoubleNavbar>
      <Breadcrumbs
        items={[
          {
            title: "Apps",
          },
          {
            title: "Report to moderators",
            href: navigateURL("apps/rtm"),
          },
        ]}
      />
      <Title order={1}>Report to moderators</Title>
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
        <Autocomplete
          label="Channel"
          placeholder="No specified channel"
          data={filterChannels(apiGuildChannels).map((channel) => ({
            id: channel.id.toString(),
            value: channel.name!,
          }))}
          sx={(theme) => ({ maxWidth: "20rem" })}
          value={localAutocompleteValue}
          onChange={(value) => {
            value === "" && setSelectedData(undefined);
            setLocalAutocompleteValue(value);
          }}
          //@ts-ignore
          onItemSubmit={setSelectedData}
          transition="pop-top-left"
          transitionDuration={80}
          icon={<HashtagIcon width={15} />}
          transitionTimingFunction="ease"
        />
      </Stack>
    </DoubleNavbar>
  );
}
