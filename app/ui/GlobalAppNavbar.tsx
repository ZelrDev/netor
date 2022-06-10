import { useState } from "react";
import {
  createStyles,
  Navbar,
  UnstyledButton,
  Tooltip,
  Title,
  ScrollArea,
  Box,
  Anchor,
  Image,
  ActionIcon,
  useMantineColorScheme,
  MediaQuery,
  Stack,
} from "@mantine/core";
import {
  LogoutIcon,
  MenuIcon,
  MoonIcon,
  SunIcon,
  UserGroupIcon,
  ViewGridIcon,
} from "@heroicons/react/solid";
import {
  Link,
  useLoaderData,
  useLocation,
  useNavigate,
  useParams,
} from "@remix-run/react";
import type { APIGuild } from "~/api-requests/apiGuild.server";
import { discordServerAvatar } from "~/utils";
import { useModals } from "@mantine/modals";

const useStyles = createStyles((theme) => ({
  wrapper: {
    display: "flex",
  },

  aside: {
    gap: theme.spacing.xs,
    flex: "0 0 70px",
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },

  section: {
    gap: theme.spacing.xs,
    flex: "0 0 70px",
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    borderRight: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[3]
    }`,
    paddingBottom: theme.spacing.xs,
  },

  main: {
    flex: 1,
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.dark[6]
        : theme.colors.gray[0],
    height: "100%",
  },

  mainLinkPill: {
    borderRadius: 999999999,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    left: 0,
    marginLeft: -9,
    width: 10,
    height: 50,
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.fn.rgba(theme.colors[theme.primaryColor][9], 0.25)
        : theme.colors[theme.primaryColor][1],
  },

  mainLinkWrapper: {
    display: "flex",
    paddingLeft: 6,
    paddingRight: 6,
  },

  actionButton: {
    width: 50,
    height: 50,
  },

  mainLink: {
    transitionProperty: "all",
    transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
    transitionDuration: "200ms",
    width: 50,
    height: 50,
    borderRadius: theme.radius.md,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.colors.gray[7],

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[5]
          : theme.colors.gray[0],
    },
  },

  mainLinkActive: {
    "&, &:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.fn.rgba(theme.colors[theme.primaryColor][9], 0.25)
          : theme.colors[theme.primaryColor][0],
      color:
        theme.colors[theme.primaryColor][theme.colorScheme === "dark" ? 4 : 7],
    },
  },

  titleContainer: {
    borderBottom: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[3]
    }`,

    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.dark[6]
        : theme.colors.gray[0],
    padding: theme.spacing.md,
    paddingTop: theme.spacing.xs,
    height: 70,
    marginBottom: theme.spacing.lg,
  },

  title: {
    boxSizing: "border-box",
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
  },

  serverTitle: {
    boxSizing: "border-box",
    fontWeight: 500,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
  },

  logo: {
    boxSizing: "border-box",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    height: 70,
    borderBottom: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[3]
    }`,
    marginBottom: theme.spacing.xs,
  },

  link: {
    transitionProperty: "all",
    transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
    transitionDuration: "200ms",
    boxSizing: "border-box",
    display: "block",
    textDecoration: "none",
    borderTopRightRadius: 99999,
    borderBottomRightRadius: 99999,
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.colors.gray[7],
    padding: `0 ${theme.spacing.md}px`,
    fontSize: theme.fontSizes.sm,
    marginRight: theme.spacing.md,
    fontWeight: 500,
    height: 44,
    lineHeight: "44px",

    "&:hover": {
      textDecoration: "none",
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[5]
          : theme.colors.gray[1],
      color: theme.colorScheme === "dark" ? theme.white : theme.black,
    },
  },

  linkActive: {
    "&, &:hover": {
      borderLeftColor:
        theme.colors[theme.primaryColor][theme.colorScheme === "dark" ? 6 : 5],
      backgroundColor:
        theme.colors[theme.primaryColor][theme.colorScheme === "dark" ? 6 : 5],
      color: theme.white,
    },
  },
}));

export function GlobalAppNavbar({
  children,
  apiGuild,
}: {
  children: any;
  apiGuild: APIGuild;
}) {
  const { classes, cx } = useStyles();
  const { pathname } = useLocation();
  const isActive = (href: string) => pathname.includes(href);
  const params = useParams();
  const navigateURL = (href: string) => `/${params.guild}/${href}`;
  const navigate = useNavigate();

  const mainLinksData = [
    {
      icon: ViewGridIcon,
      label: "Apps",
      href: "apps",
    },
    {
      icon: UserGroupIcon,
      label: "Users",
      href: "users",
    },
  ];

  const mainLinks = mainLinksData.map((link) => (
    <Tooltip
      label={link.label}
      position="right"
      withArrow
      transitionDuration={0}
      key={link.label}
    >
      <div className={classes.mainLinkWrapper}>
        {isActive(link.href) && <div className={classes.mainLinkPill}></div>}
        <Anchor component={Link} to={navigateURL(link.href)}>
          <UnstyledButton
            className={cx(classes.mainLink, {
              [classes.mainLinkActive]: isActive(link.href),
            })}
          >
            <link.icon width={20} />
          </UnstyledButton>
        </Anchor>
      </div>
    </Tooltip>
  ));

  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";
  const modals = useModals();

  return (
    <Box style={{ display: "flex", flexGrow: 2 }}>
      <Navbar height="100vh" width={{ base: 70 }}>
        <Navbar.Section grow className={classes.wrapper}>
          <div className={classes.section}>
            <div className={classes.aside}>
              <div className={classes.logo}>
                <Tooltip
                  position="right"
                  withArrow
                  transitionDuration={0}
                  label={apiGuild.name}
                >
                  <Image
                    radius="xl"
                    p="sm"
                    src={discordServerAvatar(apiGuild.id, apiGuild.icon)}
                  />
                </Tooltip>
              </div>

              {mainLinks}
            </div>
            <div>
              <Stack>
                <ActionIcon
                  variant="light"
                  size="xl"
                  radius="md"
                  color={dark ? "yellow" : "blue"}
                  onClick={() => toggleColorScheme()}
                  title="Toggle color scheme"
                  className={classes.actionButton}
                >
                  {dark ? <SunIcon height={18} /> : <MoonIcon height={18} />}
                </ActionIcon>
                <ActionIcon
                  variant="light"
                  className={classes.actionButton}
                  size="xl"
                  radius="md"
                  color={"red"}
                  onClick={() =>
                    modals.openConfirmModal({
                      centered: true,
                      title: "Are you sure you would like to logout?",
                      confirmProps: { color: "red" },
                      onConfirm: () => navigate(navigateURL("logout")),
                      labels: {
                        confirm: "Confirm",
                        cancel: "Cancel",
                      },
                    })
                  }
                  title="Logout"
                >
                  <LogoutIcon height={18} />
                </ActionIcon>
              </Stack>
            </div>
          </div>
        </Navbar.Section>
      </Navbar>
      <ScrollArea
        sx={(theme) => ({
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
          width: "100%",
          height: "100vh",
        })}
        p="xl"
      >
        {children}
      </ScrollArea>
    </Box>
  );
}
