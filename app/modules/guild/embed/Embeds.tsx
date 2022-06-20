import { Group, Paper, ScrollArea, Stack } from "@mantine/core";
import { EmbedVisualizer } from "embed-visualizer";
import { useEffect, useState } from "react";
import type { ReactElement } from "react";
import type { DBGuildEmbed, DBGuildEmbeds } from "~/models/dbGuild.server";
import { convertDBEmbedToDiscordEmbed } from "~/lib/convertDBEmbedToDiscordEmbed";

export const Embeds = (props: {
  embeds: DBGuildEmbeds;
  action: (props: { embed: DBGuildEmbed }) => ReactElement<any, any>;
}) => {
  const [containerWidth, setContainerWidth] = useState<number>(1);

  useEffect(() => {
    let width = 0;
    props.embeds.forEach((embed, idx) => {
      const el = document.getElementById(idx.toString());
      if (el?.clientWidth) width = width + el.clientWidth;
    });
    setContainerWidth(width + props.embeds.length * 45);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
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
                    ? theme.colors.dark[9]
                    : theme.colors.gray[0],
                minWidth: 240,
              })}
            >
              <Stack key={idx} id={idx.toString()}>
                <EmbedVisualizer
                  onError={(error: any) => console.log(error)}
                  embed={{ embed: convertDBEmbedToDiscordEmbed(embed) }}
                />
                <props.action embed={embed} />
              </Stack>
            </Paper>
          ))}
        </Group>
      </ScrollArea>
    </>
  );
};
