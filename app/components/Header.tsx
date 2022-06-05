import React from "react";
import {
  createStyles,
  Header,
  Container,
  Group,
  Burger,
  Title,
  Stack,
  ActionIcon,
  useMantineColorScheme,
} from "@mantine/core";
import { useBooleanToggle } from "@mantine/hooks";
import { Link, useLoaderData, useLocation, useParams } from "@remix-run/react";
import type { APIGuild } from "~/requests/apiGuild.server";
import { MoonIcon, SunIcon } from "@heroicons/react/solid";

const useStyles = createStyles((theme) => ({
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    height: "100%",
  },

  links: {
    [theme.fn.smallerThan("xs")]: {
      display: "none",
    },
  },

  burger: {
    [theme.fn.largerThan("xs")]: {
      display: "none",
    },
  },

  link: {
    display: "block",
    lineHeight: 1,
    padding: "8px 12px",
    borderRadius: theme.radius.sm,
    textDecoration: "none",
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.colors.gray[7],
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
    },
  },

  linkActive: {
    "&, &:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.fn.rgba(theme.colors[theme.primaryColor][9], 0.25)
          : theme.colors[theme.primaryColor][0],
      color:
        theme.colors[theme.primaryColor][theme.colorScheme === "dark" ? 3 : 7],
    },
  },
}));

type LoaderData = { apiGuild: APIGuild };

export function HeaderSimple() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";
  const links = [
    {
      link: "apps",
      label: "Apps",
    },
    {
      link: "users",
      label: "Users",
    },
  ];
  const [opened, toggleOpened] = useBooleanToggle(false);
  const { pathname } = useLocation();
  const { classes, cx } = useStyles();
  const { apiGuild } = useLoaderData() as LoaderData;
  const params = useParams();
  const navigateURL = (path: string) => `/${params.guild}/${path}`;

  const items = links.map((link) => (
    <Link
      key={link.label}
      to={navigateURL(link.link)}
      className={cx(classes.link, {
        [classes.linkActive]: pathname.includes(link.link),
      })}
    >
      {link.label}
    </Link>
  ));

  return (
    <>
      <Header height={60} mb={30}>
        <Container className={classes.header}>
          <Title order={3}>{apiGuild.name}</Title>
          <Group spacing={10} className={classes.links}>
            {items}
            <ActionIcon
              ml="md"
              variant="outline"
              color={dark ? "yellow" : "blue"}
              onClick={() => toggleColorScheme()}
              title="Toggle color scheme"
            >
              {dark ? <SunIcon height={18} /> : <MoonIcon height={18} />}
            </ActionIcon>
          </Group>

          <Burger
            opened={opened}
            onClick={() => toggleOpened()}
            className={classes.burger}
            size="sm"
          />
        </Container>
      </Header>
      {opened && (
        <Header mb={30} pb="lg" height={""}>
          <Stack>{items}</Stack>
        </Header>
      )}
    </>
  );
}
