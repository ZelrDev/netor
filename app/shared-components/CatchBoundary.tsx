import React from "react";
import {
  createStyles,
  Title,
  Text,
  Button,
  Container,
  Group,
} from "@mantine/core";
import { useCatch } from "@remix-run/react";
import { Document } from "./Document";
import { useTypeSafeTranslation } from "~/shared-hooks/use-type-safe-translation";

const useStyles = createStyles((theme) => ({
  root: {
    paddingTop: 80,
    paddingBottom: 80,
  },

  label: {
    textAlign: "center",
    fontWeight: 900,
    fontSize: 220,
    lineHeight: 1,
    marginBottom: theme.spacing.xl * 1.5,
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[4]
        : theme.colors.gray[2],

    [theme.fn.smallerThan("sm")]: {
      fontSize: 120,
    },
  },

  title: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    textAlign: "center",
    fontWeight: 900,
    fontSize: 38,

    [theme.fn.smallerThan("sm")]: {
      fontSize: 32,
    },
  },

  description: {
    maxWidth: 500,
    margin: "auto",
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.xl * 1.5,
  },
}));

export const CatchBoundary = () => {
  const { classes } = useStyles();
  const caught = useCatch();
  const { t } = useTypeSafeTranslation();

  return caught.data?.raw_error ? (
    caught.data?.message
  ) : (
    <Document>
      <Container className={classes.root}>
        <div className={classes.label}>{caught?.status}</div>
        <Title className={classes.title}>
          {caught.status === 404 ? t("errors.notFound") : caught.data?.title}
        </Title>
        <Text
          color="dimmed"
          size="lg"
          align="center"
          className={classes?.description}
        >
          {caught.data?.message}
        </Text>
        <Group position="center">
          <Button onClick={() => history.back()} variant="subtle" size="md">
            {t("common.goBack")}
          </Button>
        </Group>
      </Container>
    </Document>
  );
};
