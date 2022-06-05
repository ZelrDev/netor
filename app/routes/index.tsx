import { Hero } from "~/components/branding/Hero";
import { FeatureImage } from "~/components/branding/FeatureImage";
import { FlexFeatureImage } from "~/components/branding/FlexFeatureImage";
import { Box, useMantineTheme } from "@mantine/core";
import punishmentHistory from "~/images/punishment_history.png";
import configCommandList from "~/images/config_command_list.png";
import viewUser from "~/images/view_user.png";
import { useRef } from "react";

export default function Index() {
  const theme = useMantineTheme();
  const ref = useRef<HTMLDivElement>(null);

  return (
    <Box>
      <Hero _ref={ref} />
      <FeatureImage
        _ref={ref}
        name="Easily"
        title="Punishment History"
        description="Gain access to a member's full punishment history in just 2
          clicks. No login to Discord. Just a link!"
        image={punishmentHistory}
      />
      <FlexFeatureImage
        name="Uniquely"
        title="View User Links"
        description="Netor is built with speed in mind and so offers the benefits of having a bot dashboard without the efforts of trying to login and authorize with Discord. With one click links to manage your entire server and view users."
        backgroundColor={
          theme.colorScheme === "dark"
            ? theme.colors.dark[8]
            : theme.colors.gray[0]
        }
        image={viewUser}
      />
      <FlexFeatureImage
        name="Effortlessly"
        title="Auto completion with commands"
        description="We built Netor with the new Discord features in mind, such as slash commands to make a integrated experience and it easy for new users to pick up how everything works."
        image={configCommandList}
        reverse
      />
    </Box>
  );
}
