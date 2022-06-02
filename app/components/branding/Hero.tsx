import React from "react";
import {
  Title,
  Text,
  Container,
  Button,
  Overlay,
  createStyles,
  Center,
} from "@mantine/core";
import heroImage from "~/images/hero.png";

const useStyles = createStyles((theme) => ({
  wrapper: {
    position: "relative",
    paddingTop: 180,
    height: "100vh",
    paddingBottom: 130,
    backgroundImage: "url(" + heroImage + ")",
    backgroundSize: "cover",
    backgroundPosition: "center",

    "@media (max-width: 520px)": {
      paddingTop: 80,
      paddingBottom: 50,
    },
  },

  inner: {
    position: "relative",
    display: "flex",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },

  title: {
    fontWeight: 800,
    fontSize: 40,
    letterSpacing: -1,
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,
    color: theme.white,
    marginBottom: theme.spacing.xs,
    textAlign: "center",
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,

    "@media (max-width: 520px)": {
      fontSize: 28,
      textAlign: "left",
    },
  },

  highlight: {
    color: theme.colors[theme.primaryColor][4],
  },

  description: {
    color: theme.colors.gray[0],
    textAlign: "center",

    "@media (max-width: 520px)": {
      fontSize: theme.fontSizes.md,
      textAlign: "left",
    },
  },

  controls: {
    marginTop: theme.spacing.xl * 1.5,
    display: "flex",
    justifyContent: "center",
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,

    "@media (max-width: 520px)": {
      flexDirection: "column",
    },
  },

  control: {
    height: 42,
    fontSize: theme.fontSizes.md,

    "&:not(:first-of-type)": {
      marginLeft: theme.spacing.md,
    },

    "@media (max-width: 520px)": {
      "&:not(:first-of-type)": {
        marginTop: theme.spacing.md,
        marginLeft: 0,
      },
    },
  },

  secondaryControl: {
    color: theme.white,
    backgroundColor: "rgba(255, 255, 255, .4)",

    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, .45) !important",
    },
  },
}));

export function Hero(props: { _ref: React.RefObject<HTMLDivElement> }) {
  const { classes, cx } = useStyles();

  return (
    <div className={classes.wrapper}>
      <Overlay color="#000" opacity={0.65} zIndex={1} />

      <div className={classes.inner}>
        <div>
          <Title className={classes.title}>
            A bot that{" "}
            <Text component="span" inherit className={classes.highlight}>
              fully integrates{" "}
            </Text>
            with Discord
          </Title>

          <Container size={640}>
            <Text size="lg" className={classes.description}>
              Moderate with ease. No need for extra commands, right click on the
              user and ban. Automatically logs all punishments.
            </Text>
          </Container>

          <div className={classes.controls}>
            <Button className={classes.control} variant="white" size="lg">
              Invite bot
            </Button>
            <Button
              className={cx(classes.control, classes.secondaryControl)}
              onClick={() =>
                props._ref?.current?.scrollIntoView({ behavior: "smooth" })
              }
              size="lg"
            >
              Learn more
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
