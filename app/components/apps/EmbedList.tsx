import { HashtagIcon } from "@heroicons/react/solid";
import {
  Autocomplete,
  Button,
  Group,
  Modal,
  Paper,
  ScrollArea,
  Stack,
} from "@mantine/core";
import { useModals } from "@mantine/modals";
import { useLoaderData, useSubmit } from "@remix-run/react";
import { EmbedVisualizer } from "embed-visualizer";
import { useEffect, useState } from "react";
import type {
  DBGuild,
  DBGuildEmbed,
  DBGuildEmbeds,
} from "~/models/dbGuild.server";
import type { APIGuild } from "~/requests/apiGuild.server";
import type { APIGuildChannels } from "~/requests/apiGuildChannels.server";
import { convertDBEmbedToDiscordEmbed } from "~/utils";
import { ButtonsGroup } from "../ButtonsGroup";

type LoaderData = {
  dbGuild: DBGuild;
  dbGuildEmbeds: DBGuildEmbeds;
  apiGuild: APIGuild;
  apiGuildChannels: APIGuildChannels;
};

const filterChannels = (channels: APIGuildChannels) =>
  channels.filter((channel) => channel.type === 0);

export const EmbedList = (props: { embeds: DBGuildEmbeds }) => {
  const [containerWidth, setContainerWidth] = useState<number>(1);
  const modals = useModals();
  const [opened, setOpened] = useState(false);
  const [channelError, setChannelError] = useState<boolean>();
  const [currentEmbed, setCurrentEmbed] = useState<DBGuildEmbed>();
  const { apiGuildChannels } = useLoaderData() as LoaderData;
  const submit = useSubmit();
  const [channel, setChannel] = useState<{
    id: string;
    value: string;
  }>();

  useEffect(() => {
    let width = 0;
    props.embeds.forEach((embed, idx) => {
      const el = document.getElementById(idx.toString());
      if (el?.clientWidth) width = width + el.clientWidth;
    });
    setContainerWidth(width + props.embeds.length * 45);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const deleteEmbed = (embedId: number) => {
    let formData = new FormData();
    formData.append("delete_embed", "true");
    formData.append("embed_id", embedId.toString());
    submit(formData, { method: "post" });
  };

  const sendEmbed = (embed: DBGuildEmbed) => {
    setCurrentEmbed(embed);
    setOpened(true);
  };

  return (
    <>
      <Modal
        centered
        opened={opened}
        onClose={() => setOpened(false)}
        title="Send Embed"
      >
        <Stack>
          <Autocomplete
            label="Channel"
            placeholder="No specified channel"
            data={filterChannels(apiGuildChannels).map((channel) => ({
              id: channel.id.toString(),
              value: channel.name!,
            }))}
            onItemSubmit={(item) => {
              //@ts-ignore
              setChannel(item);
              setChannelError(false);
            }}
            transition="pop-top-left"
            transitionDuration={80}
            icon={<HashtagIcon width={15} />}
            transitionTimingFunction="ease"
            error={channelError}
          />
          <Button
            onClick={() => {
              if (!channel) return setChannelError(true);
              let formData = new FormData();
              formData.append("send_embed", "true");
              formData.append("channel_id", channel.id);
              formData.append(
                "embed",
                JSON.stringify(convertDBEmbedToDiscordEmbed(currentEmbed!))
              );
              submit(formData, { method: "post" });
            }}
          >
            Send
          </Button>
        </Stack>
      </Modal>

      <ScrollArea mt="md" pb="lg">
        <Group
          style={{
            width: containerWidth === 1 ? 999999 : containerWidth,
            alignItems: "start",
          }}
        >
          {props.embeds.map((embed, idx) => (
            <Paper
              key={idx}
              p="md"
              radius="md"
              shadow="sm"
              sx={(theme) => ({
                backgroundColor:
                  theme.colorScheme === "dark"
                    ? theme.colors.dark[8]
                    : theme.colors.gray[0],
                minWidth: 200,
              })}
            >
              <Stack key={idx} id={idx.toString()}>
                <EmbedVisualizer
                  onError={(error: any) => console.log(error)}
                  embed={{ embed: convertDBEmbedToDiscordEmbed(embed) }}
                />
                <ButtonsGroup>
                  <Button onClick={() => sendEmbed(embed)} variant="light">
                    Send
                  </Button>
                  <Button
                    onClick={() =>
                      modals.openConfirmModal({
                        centered: true,
                        title:
                          "Are you sure you would like to remove this embed?",
                        confirmProps: { color: "red" },
                        onConfirm: () => deleteEmbed(embed.id),
                        labels: {
                          confirm: "Confirm",
                          cancel: "Cancel",
                        },
                      })
                    }
                    variant="light"
                    color="red"
                  >
                    Delete
                  </Button>
                </ButtonsGroup>
              </Stack>
            </Paper>
          ))}
        </Group>
      </ScrollArea>
    </>
  );
};
