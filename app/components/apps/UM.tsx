import { CheckIcon, HashtagIcon } from "@heroicons/react/solid";
import { Stack, Autocomplete, Text, Button, Box } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useLoaderData, useSubmit } from "@remix-run/react";
import { useState, useEffect, useMemo } from "react";
import type { DBGuild } from "~/models/dbGuild.server";
import type { APIGuild } from "~/requests/apiGuild.server";
import type { APIGuildChannels } from "~/requests/apiGuildChannels.server";
import { RichText } from "../RTE";

const filterChannels = (channels: APIGuildChannels) =>
  channels.filter((channel) => channel.type === 0);

type LoaderData = {
  dbGuild: DBGuild;
  apiGuild: APIGuild;
  apiGuildChannels: APIGuildChannels;
};

export const tags = [
  { id: "", value: "Mention User" },
  { id: "", value: "Username" },
  { id: "", value: "Server Name" },
  { id: "", value: "Channel Name" },
  { id: "", value: "Mention Everyone" },
  { id: "", value: "Mention Here" },
];

export const UM = (props: { type: "WELCOME" | "LEAVE" }) => {
  const { dbGuild, apiGuildChannels } = useLoaderData() as LoaderData;
  const [channelSelectedData, setChannelSelectedData] = useState<{
    id: string;
    value: string;
  }>();
  const [localAutocompleteValue, setLocalAutocompleteValue] = useState(
    channelSelectedData?.value
  );
  const [message, setMessage] = useState("");
  const [ready, setReady] = useState<boolean>(false);
  const submit = useSubmit();

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
    let formData = new FormData();
    formData.append(
      `${props.type.toLowerCase()}_channel`,
      channelSelectedData?.id!.toString() ?? ""
    );
    formData.append(`${props.type.toLowerCase()}_msg`, message);

    submit(formData, { method: "post" });

    showNotification({
      title: "Success",
      color: "teal",
      icon: <CheckIcon height={16} />,
      message: "Saved your data",
    });
  };

  return ready ? (
    <Stack spacing="xs">
      <Autocomplete
        label={(props.type === "WELCOME" ? "Welcome" : "Leave") + " Channel"}
        placeholder="No specified channel"
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
        {(props.type === "WELCOME" ? "Welcome" : "Leave") + " Message"}
      </Text>
      <RichText
        mentions={mentions}
        controls={[]}
        placeholder="Type ^ to see variable auto completion."
        value={message}
        sx={(theme) => ({ maxWidth: "80rem" })}
        onChange={(str) => setMessage(str)}
      />
      <Box style={{ display: "flex" }}>
        <Button onClick={request}>Save</Button>
      </Box>
    </Stack>
  ) : null;
};
