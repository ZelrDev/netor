import { HashtagIcon } from "@heroicons/react/solid";
import { Modal, Stack, Autocomplete, Button } from "@mantine/core";
import { useModals } from "@mantine/modals";
import { useState } from "react";
import type { DBGuildEmbed, DBGuildEmbeds } from "~/models/dbGuild.server";
import type { APIGuild } from "~/api-requests/apiGuild.server";
import type { APIGuildChannels } from "~/api-requests/apiGuildChannels.server";
import { Embeds } from "./Embeds";
import { ButtonsGroup } from "~/ui/ButtonsGroup";
import { useGuild } from "../use-guild";
import { useTypeSafeTranslation } from "~/shared-hooks/use-type-safe-translation";
import { convertDBEmbedToDiscordEmbed } from "~/lib/convertDBEmbedToDiscordEmbed";

const filterChannels = (channels: APIGuildChannels) =>
  channels.filter((channel) => channel.type === 0);

export const EmbedSend = (props: {
  apiGuildChannels: APIGuildChannels;
  dbGuildEmbeds: DBGuildEmbeds;
  apiGuild: APIGuild;
}) => {
  const [channel, setChannel] = useState<{
    id: string;
    value: string;
  }>();
  const { t } = useTypeSafeTranslation();
  const [opened, setOpened] = useState(false);
  const { removeEmbed, sendEmbed } = useGuild(props.apiGuild);
  const [channelError, setChannelError] = useState<boolean>();
  const [currentEmbed, setCurrentEmbed] = useState<DBGuildEmbed>();
  const modals = useModals();

  return (
    <>
      <Modal
        centered
        opened={opened}
        onClose={() => setOpened(false)}
        title={t("modules.embedGenerator.dialog.sendEmbed.title")}
      >
        <Stack>
          <Autocomplete
            label={t("discord.channel")}
            placeholder={t("placeholders.noSpecifiedChannel")}
            data={filterChannels(props.apiGuildChannels).map((channel) => ({
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
              setOpened(false);
              sendEmbed(
                convertDBEmbedToDiscordEmbed(currentEmbed!),
                channel.id
              );
            }}
          >
            {t("common.send")}
          </Button>
        </Stack>
      </Modal>
      <Embeds
        embeds={props.dbGuildEmbeds}
        action={({ embed }) => (
          <ButtonsGroup>
            <Button
              onClick={() => {
                setCurrentEmbed(embed);
                setOpened(true);
              }}
            >
              {t("common.send")}
            </Button>
            <Button
              onClick={() =>
                modals.openConfirmModal({
                  centered: true,
                  title: t("modules.embedGenerator.dialog.removeEmbed.title"),
                  confirmProps: { color: "red" },
                  onConfirm: () => removeEmbed(embed.id),
                  labels: {
                    confirm: t("common.confirm"),
                    cancel: t("common.cancel"),
                  },
                })
              }
              color="red"
            >
              {t("common.remove")}
            </Button>
          </ButtonsGroup>
        )}
      />
    </>
  );
};
