import { Anchor, Box, createStyles, Group, Stack, Text } from "@mantine/core";
import { Link, useLocation } from "@remix-run/react";
import React from "react";

const useStyles = createStyles((theme) => ({
  wrapper: {},
  text: {
    marginBottom: 7,
  },
  link: {
    paddingLeft: 2,
    paddingRight: 2,
    borderBottom: "2px solid",
    borderBottomColor: "transparent",
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[1]
        : theme.colors.gray[7],
    "&:hover": {
      color:
        theme.colorScheme === "dark"
          ? theme.colors.dark[0]
          : theme.colors.gray[8],
      textDecoration: "none",
      borderBottomColor: theme.colors.gray[6],
    },
    transitionProperty: "all",
    transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
    transitionDuration: "200ms",
  },
  linkActive: {
    color:
      theme.colorScheme === "dark"
        ? theme.colors.indigo[4]
        : theme.colors.indigo[9],
    "&:hover": {
      color:
        theme.colorScheme === "dark"
          ? theme.colors.indigo[4]
          : theme.colors.indigo[9],
      borderBottomColor: theme.colors.indigo[5],
    },
    borderBottom: "2px solid",
    borderBottomColor: theme.colors.indigo[5],
  },
}));

export const AppsNavbar = (props: {
  children: React.ReactNode;
  routes: {
    label: string;
    href: string;
    icon: (props: React.SVGProps<SVGSVGElement>) => JSX.Element;
  }[];
}) => {
  const { pathname } = useLocation();
  const { classes, cx } = useStyles();

  return (
    <Stack>
      <Group className={classes.wrapper} spacing="xl">
        {props.routes.map((route) => (
          <Anchor
            className={cx(classes.link, {
              [classes.linkActive]: pathname.includes(route.href),
            })}
            component={Link}
            to={route.href}
            key={route.href}
          >
            <Group spacing="xs" className={classes.text}>
              <route.icon height={20} />
              <Text weight={500}>{route.label}</Text>
            </Group>
          </Anchor>
        ))}
      </Group>
      <Box>{props.children}</Box>
    </Stack>
  );
};
