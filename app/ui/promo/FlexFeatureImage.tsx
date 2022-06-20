import React from "react";
import {
  Title,
  Text,
  Container,
  createStyles,
  Group,
  Image,
  Stack,
  Box,
  useMantineTheme,
} from "@mantine/core";
import { Dots } from "~/ui/Dots";
import { FeatureImage } from "./FeatureImage";
import { useMediaQuery } from "@mantine/hooks";

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
    position: "relative",
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[5]
        : theme.colors.gray[1],

    ["@media (max-width: " + theme.breakpoints.xl + "px)"]: {
      display: "none",
    },
  },
}));

export function FlexFeatureImage(props: {
  image: string;
  name: string;
  title: string;
  description: string;
  backgroundColor?: string;
  reverse?: boolean;
}) {
  const { classes } = useStyles();
  const theme = useMantineTheme();
  const xs = useMediaQuery(`(max-width: ${theme.breakpoints.xs}px)`, false);

  return (
    <div>
      {xs ? (
        <FeatureImage {...props} />
      ) : (
        <div
          style={{
            backgroundColor: props.backgroundColor,
          }}
          className={classes.inner}
        >
          <Container style={{ height: "100%", maxWidth: 1300 }}>
            <Group
              spacing="xl"
              style={{
                justifyContent: "space-between",
                alignItems: "center",
                height: "100%",
                flexDirection: props.reverse ? "row-reverse" : "row",
              }}
              grow
            >
              <Stack>
                <Box
                  className="floating"
                  style={{
                    display: "flex",
                    justifyContent: props.reverse ? "end" : "start",
                    flexDirection: props.reverse ? "row-reverse" : "row",
                  }}
                >
                  <Image
                    radius="md"
                    className={classes.image}
                    src={props.image}
                  />
                  <Dots
                    className={classes.dots}
                    style={
                      props.reverse
                        ? { left: 100, bottom: -50 }
                        : { right: 100, bottom: -50 }
                    }
                  />
                </Box>
              </Stack>
              <Stack spacing="xs">
                <Text weight={500} color="indigo" align="left" mb="-10px">
                  {props.name}
                </Text>
                <Title
                  style={{
                    zIndex: 20,
                    fontWeight: 900,
                  }}
                  align="left"
                >
                  {props.title}
                </Title>
                <Text
                  style={{
                    zIndex: 20,
                  }}
                  size="xl"
                  mx="auto"
                  align="left"
                  pb="xl"
                >
                  {props.description}
                </Text>
              </Stack>
            </Group>
          </Container>
        </div>
      )}
    </div>
  );
}
