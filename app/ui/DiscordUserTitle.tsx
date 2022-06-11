import { Group, Avatar, Title } from "@mantine/core";
import { discordAvatar } from "~/lib/discordServerAvatar";
import { ThemeChip } from "./ThemeChip";

export const DiscordUserTitle = (props: {
  owner: boolean;
  id: string;
  avatarHash?: string | null;
  username: string;
}) => {
  return (
    <Group>
      <Avatar radius="xl" src={discordAvatar(props.id, props.avatarHash)} />

      <Title order={2}>{props.username}</Title>

      {props.owner && <ThemeChip text="OWNER" color="indigo" />}
    </Group>
  );
};
