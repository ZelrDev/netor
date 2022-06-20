import { useEffect, useState } from "react";
import type { APIGuildChannels } from "~/api-requests/apiGuildChannels.server";
import { Autocomplete, Stack, Switch, Title } from "@mantine/core";
import { HashtagIcon } from "@heroicons/react/solid";
import { useGuild } from "~/modules/guild/use-guild";
import type { LoaderData } from "~/routes/$guild/apps";
import { useData } from "~/shared-hooks/use-data";
import { useTypeSafeTranslation } from "~/shared-hooks/use-type-safe-translation";
import type { MetaFunction } from "@remix-run/server-runtime";
import { customMeta } from "~/meta";
export const meta: MetaFunction = customMeta({
  title: "Report to moderators | Netor",
});

const filterChannels = (channels: APIGuildChannels) =>
  channels.filter((channel) => channel.type === 0);

export default function Index() {
  const { dbGuild, apiGuild, apiGuildChannels } = useData() as LoaderData;
  const [selectedData, setSelectedData] = useState<{
    id: string;
    value: string;
  }>();
  const [checked, setChecked] = useState<boolean>(false);
  const [localAutocompleteValue, setLocalAutocompleteValue] = useState(
    selectedData?.value
  );
  const { updateRTMChannel, toggleRTM } = useGuild(apiGuild);
  const [ready, setReady] = useState<boolean>(false);
  const { t } = useTypeSafeTranslation();

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
    setTimeout(() => setReady(true), 500);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (ready) {
      if (dbGuild.rtm_enabled === checked) updateRTMChannel(selectedData?.id);
      else toggleRTM();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedData, checked]);

  return (
    <>
      <Title order={2}>{t("modules.reportToModerators.name")}</Title>
      <Stack spacing="md" pt="md">
        <Switch
          checked={checked}
          onChange={(event) => setChecked(event.currentTarget.checked)}
          label={t("common.enabled")}
        />
        <Autocomplete
          label={t("discord.channel")}
          placeholder={t("placeholders.noSpecifiedChannel")}
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
    </>
  );
}
