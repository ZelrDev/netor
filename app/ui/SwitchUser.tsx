import { ArrowRightIcon } from "@heroicons/react/solid";
import {
  Center,
  Paper,
  Stack,
  Title,
  Group,
  ThemeIcon,
  Button,
  Image,
  Text,
} from "@mantine/core";
import type { APIUser } from "~/api-requests/apiUser.server";
import { discordAvatar } from "~/lib/discordServerAvatar";
import { ButtonsGroup } from "./ButtonsGroup";

export interface SwitchUserProps {
  beforeUser: APIUser;
  afterUser: APIUser;
  switchUser: (x: boolean) => void;
}

export const SwitchUser: React.FC<SwitchUserProps> = ({
  beforeUser,
  afterUser,
  switchUser,
}) => {
  return (
    <Center style={{ height: "100vh" }}>
      <Paper
        p="md"
        sx={(theme) => ({
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[6]
              : theme.colors.gray[0],
        })}
        shadow="md"
        radius="md"
      >
        <Stack>
          <Title
            align="center"
            style={{
              fontWeight: 900,
            }}
          >
            Switch user?
          </Title>
          <Group>
            <Paper
              p="md"
              sx={(theme) => ({
                backgroundColor:
                  theme.colorScheme === "dark"
                    ? theme.colors.dark[7]
                    : theme.colors.gray[0],
              })}
              shadow="md"
              radius="md"
            >
              <Image
                radius="md"
                src={discordAvatar(beforeUser.id, beforeUser.avatar)}
              />
              <Title order={2} pt="xs">
                {beforeUser.username}
              </Title>
              <Text weight={400}>#{beforeUser.discriminator}</Text>
            </Paper>
            <ThemeIcon
              sx={(theme) => ({
                boxShadow: theme.shadows.md,
              })}
              variant="gradient"
              gradient={{ from: "blue", to: "indigo" }}
              radius="xl"
              size="xl"
            >
              <ArrowRightIcon style={{ padding: 10 }} />
            </ThemeIcon>
            <Paper
              p="md"
              sx={(theme) => ({
                backgroundColor:
                  theme.colorScheme === "dark"
                    ? theme.colors.dark[7]
                    : theme.colors.gray[0],
              })}
              shadow="md"
              radius="md"
            >
              <Image
                radius="md"
                src={discordAvatar(afterUser.id, afterUser.avatar)}
              />
              <Title order={2} pt="xs">
                {afterUser.username}
              </Title>
              <Text weight={400}>#{afterUser.discriminator}</Text>
            </Paper>
          </Group>
          <ButtonsGroup>
            <Button onClick={() => switchUser(true)}>Yes</Button>
            <Button onClick={() => switchUser(false)}>No</Button>
          </ButtonsGroup>
        </Stack>
      </Paper>
    </Center>
  );
};
