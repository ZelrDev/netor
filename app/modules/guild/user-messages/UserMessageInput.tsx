import { CheckIcon, HashtagIcon } from "@heroicons/react/solid";
import { Stack, Autocomplete, Text, Button, Box } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useState, useEffect, useMemo } from "react";
import type { DBGuild } from "~/models/dbGuild.server";
import type { APIGuildChannels } from "~/api-requests/apiGuildChannels.server";
import { RichText } from "../../../ui/RTE";
import { useGuild } from "../use-guild";
import { useTypeSafeTranslation } from "~/shared-hooks/use-type-safe-translation";

const filterChannels = (channels: APIGuildChannels) =>
  channels.filter((channel) => channel.type === 0);

export const tags = [
  { id: "", value: "Mention User" },
  { id: "", value: "Username" },
  { id: "", value: "Server Name" },
  { id: "", value: "Channel Name" },
  { id: "", value: "Mention Everyone" },
  { id: "", value: "Mention Here" },
];

export const UM = (props: {
  type: "WELCOME" | "LEAVE";
  dbGuild: DBGuild;
  apiGuildChannels: APIGuildChannels;
}) => {
  const { t } = useTypeSafeTranslation();

  const tags = [
    {
      id: "",
      value: t("modules.userMessages.editor.interpolation.mentionUser"),
    },
    { id: "", value: t("modules.userMessages.editor.interpolation.username") },
    {
      id: "",
      value: t("modules.userMessages.editor.interpolation.serverName"),
    },
    {
      id: "",
      value: t("modules.userMessages.editor.interpolation.channelName"),
    },
    {
      id: "",
      value: t("modules.userMessages.editor.interpolation.mentionEveryone"),
    },
    {
      id: "",
      value: t("modules.userMessages.editor.interpolation.mentionHere"),
    },
  ];

  const { dbGuild, apiGuildChannels } = props;
  const [channelSelectedData, setChannelSelectedData] = useState<{
    id: string;
    value: string;
  }>();
  const [localAutocompleteValue, setLocalAutocompleteValue] = useState(
    channelSelectedData?.value
  );
  const [message, setMessage] = useState("");
  const [ready, setReady] = useState<boolean>(false);
  const { updateUM } = useGuild(dbGuild);

  const mentions = useMemo(
    () => ({
      allowedChars: /^[A-Za-z\sÅÄÖåäö]*$/,
      mentionDenotationChars: ["^"],
      source: (searchTerm: any, renderList: any, mentionChar: any) => {
        const list = tags;
        const includesSearchTerm = list?.filter((item: { value: string }) =>
          item.value.toLowerCase().includes(searchTerm.toLowerCase())
        );
        renderList(includesSearchTerm);
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    setLocalAutocompleteValue(channelSelectedData?.value);
  }, [channelSelectedData]);

  useEffect(() => {
    const channel = apiGuildChannels.filter(
      (channel) =>
        channel.id ===
        (props.type === "WELCOME"
          ? dbGuild.um_welcome_channel_id
          : dbGuild.um_leave_channel_id)
    );
    if (channel.length === 1) {
      setChannelSelectedData({
        id: channel[0].id!,
        value: channel[0].name!,
      });
    }
    setMessage(
      props.type === "WELCOME"
        ? dbGuild.um_welcome_raw_msg
        : dbGuild.um_leave_raw_msg
    );
    setReady(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const request = () => {
    updateUM({
      msg: message,
      type: props.type,
      channel_id: channelSelectedData?.id,
    });
    showNotification({
      title: t("common.success"),
      color: "teal",
      icon: <CheckIcon height={16} />,
      message: t("alert.savedData"),
    });
  };

  return ready ? (
    <Stack spacing="xs">
      <Autocomplete
        label={
          props.type === "WELCOME"
            ? t("modules.userMessages.welcome.labelChannel")
            : t("modules.userMessages.leave.labelChannel")
        }
        placeholder={t("placeholders.noSpecifiedChannel")}
        data={filterChannels(apiGuildChannels).map((channel) => ({
          id: channel.id.toString(),
          value: channel.name!,
        }))}
        sx={(theme) => ({ maxWidth: "20rem" })}
        value={localAutocompleteValue}
        onChange={(value) => {
          value === "" && setChannelSelectedData(undefined);
          setLocalAutocompleteValue(value);
        }}
        //@ts-ignore
        onItemSubmit={setChannelSelectedData}
        transition="pop-top-left"
        transitionDuration={80}
        icon={<HashtagIcon width={15} />}
        transitionTimingFunction="ease"
      />
      <Text
        weight={600}
        size="xs"
        style={{
          position: "absolute",
          marginTop: 77,
          marginLeft: 15,
          zIndex: 10,
        }}
      >
        {props.type === "WELCOME"
          ? t("modules.userMessages.welcome.labelMessage")
          : t("modules.userMessages.leave.labelMessage")}
      </Text>
      <RichText
        mentions={mentions}
        controls={[]}
        placeholder={t("modules.userMessages.rtePlaceholder")}
        value={message}
        sx={(theme) => ({ maxWidth: "80rem" })}
        onChange={(str) => setMessage(str)}
      />
      <Box style={{ display: "flex" }}>
        <Button onClick={request}>{t("common.save")}</Button>
      </Box>
    </Stack>
  ) : null;
};
