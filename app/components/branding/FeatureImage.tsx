import React from "react";
import { Title, Text, Container, createStyles, Image } from "@mantine/core";
import { Dots } from "~/components/Dots";

const useStyles = createStyles((theme) => ({
  inner: {
    paddingTop: 70,
    paddingBottom: 70,
    position: "relative",
    zIndex: 1,
  },
  container: {
    justifyContent: "space-between",
  },
  image: {
    boxShadow: theme.shadows.lg,
  },
  dots: {
    zIndex: -1,
    position: "absolute",
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[5]
        : theme.colors.gray[1],

    ["@media (max-width: " + theme.breakpoints.xl + "px)"]: {
      display: "none",
    },
  },
}));

export function FeatureImage(props: {
  image: string;
  name: string;
  title: string;
  description: string;
  backgroundColor?: string;
  _ref?: React.RefObject<HTMLDivElement>;
}) {
  const { classes } = useStyles();

  return (
    <div
      ref={props._ref}
      style={{
        backgroundColor: props.backgroundColor,
      }}
      className={classes.inner}
    >
      <Container>
        <Text weight={600} color="indigo" align="center" mb="-10px">
          {props.name}
        </Text>
        <Title
          style={{
            zIndex: 20,
          }}
          align="center"
        >
          {props.title}
        </Title>
        <Text
          style={{
            maxWidth: 500,
            zIndex: 20,
          }}
          mx="auto"
          align="center"
          pb="xl"
        >
          {props.description}
        </Text>
        <Dots className={classes.dots} style={{ left: 400, top: 50 }} />
        <Dots className={classes.dots} style={{ left: 340, top: 50 }} />
        <Dots className={classes.dots} style={{ left: 400, top: 290 }} />
        <Dots className={classes.dots} style={{ right: 400, top: 60 }} />
        <Image
          pt="sm"
          radius="md"
          className={classes.image + " floating"}
          src={props.image}
        />
      </Container>
    </div>
  );
}
