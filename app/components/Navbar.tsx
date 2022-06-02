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
import type { APIGuild } from "~/requests/apiGuild.server";
import { discordServerAvatar } from "~/utils";
import { useModals } from "@mantine/modals";
type LoaderData = {
  apiGuild: APIGuild;
};
const useStyles = createStyles((theme) => ({
  wrapper: {
    display: "flex",
  },

  aside: {
    gap: theme.spacing.xs,
    flex: "0 0 60px",
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    borderRight: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.colors.gray[3]
    }`,
  },

  section: {
    gap: theme.spacing.xs,
    flex: "0 0 60px",
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    borderRight: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.colors.gray[3]
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

  mainLink: {
    transitionProperty: "all",
    transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
    transitionDuration: "200ms",
    width: 44,
    height: 44,
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

  title: {
    boxSizing: "border-box",
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    marginBottom: theme.spacing.xl,
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
    padding: theme.spacing.md,
    paddingTop: 18,
    height: 60,
    borderBottom: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.colors.gray[3]
    }`,
  },

  logo: {
    boxSizing: "border-box",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    height: 60,
    borderBottom: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.colors.gray[3]
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
        theme.colors[theme.primaryColor][theme.colorScheme === "dark" ? 7 : 5],
      backgroundColor:
        theme.colors[theme.primaryColor][theme.colorScheme === "dark" ? 7 : 5],
      color: theme.white,
    },
  },
}));

export function DoubleNavbar({ children }: { children: any }) {
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
      links: [
        { label: "Report to moderators", href: "rtm" },
        { label: "Embed Generator", href: "embed-generator" },
        { label: "User Messages", href: "um" },
      ],
    },
    {
      icon: UserGroupIcon,
      label: "Users",
      href: "users",
      links: params?.member
        ? [
            {
              label: "Overview",
              href: `${params.member}/overview`,
            },
            {
              label: "Punishment History",
              href: `${params.member}/punishment-history`,
            },
          ]
        : undefined,
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
      <Anchor component={Link} to={navigateURL(link.href)}>
        <UnstyledButton
          className={cx(classes.mainLink, {
            [classes.mainLinkActive]: isActive(link.href),
          })}
        >
          <link.icon width={20} />
        </UnstyledButton>
      </Anchor>
    </Tooltip>
  ));

  const links = mainLinksData
    .find((link) => isActive(link.href))
    ?.links?.map((link) => (
      <Anchor
        className={cx(classes.link, {
          [classes.linkActive]: isActive(link.href),
        })}
        to={navigateURL(
          `${mainLinksData.find((link) => isActive(link.href))?.href}/${
            link.href
          }`
        )}
        component={Link}
        key={link.label}
      >
        {link.label}
      </Anchor>
    ));

  const linksExist = mainLinksData.find((link) => isActive(link.href))?.links
    ? true
    : false;
  const [menu, setMenu] = useState(false);
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";
  const { apiGuild } = useLoaderData() as LoaderData;
  const modals = useModals();

  return (
    <Box style={menu ? undefined : { display: "flex", flexGrow: 2 }}>
      <Navbar
        height="100vh"
        width={{ sm: linksExist ? 300 : 61, base: menu ? "100vw" : 61 }}
      >
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

              <MediaQuery largerThan="sm" styles={{ display: "none" }}>
                <ActionIcon
                  size="xl"
                  disabled={!linksExist}
                  radius="md"
                  color="indigo"
                  variant="filled"
                  onClick={() => setMenu(!menu)}
                  title="Toggle menu"
                >
                  <MenuIcon height={18} />
                </ActionIcon>
              </MediaQuery>
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
                >
                  {dark ? <SunIcon height={18} /> : <MoonIcon height={18} />}
                </ActionIcon>
                <ActionIcon
                  variant="light"
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
          <MediaQuery largerThan="sm" styles={{ display: "none" }}>
            <div style={{ width: "100%", height: "100%" }}>
              {linksExist && menu && (
                <div className={classes.main}>
                  <Title order={4} className={classes.title}>
                    {mainLinksData.find((link) => isActive(link.href))?.label}
                  </Title>

                  {links}
                </div>
              )}
            </div>
          </MediaQuery>
          <MediaQuery smallerThan="sm" styles={{ display: "none" }}>
            <div style={{ width: "100%", height: "100%" }}>
              {linksExist && (
                <div className={classes.main}>
                  <Title order={4} className={classes.title}>
                    {mainLinksData.find((link) => isActive(link.href))?.label}
                  </Title>

                  {links}
                </div>
              )}
            </div>
          </MediaQuery>
        </Navbar.Section>
      </Navbar>
      {!menu && (
        <ScrollArea
          style={{
            width: "100%",
            height: "100vh",
          }}
          p="lg"
        >
          {children}
        </ScrollArea>
      )}
    </Box>
  );
}
