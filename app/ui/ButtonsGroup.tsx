import React from "react";
import { createStyles, Group } from "@mantine/core";

const useStyles = createStyles((theme) => ({
  wrapper: {
    "& > button": {
      borderRadius: 0,

      "&:not(:first-of-type)": {
        borderLeftWidth: 0,
      },

      "&:first-of-type": {
        borderTopLeftRadius: theme.radius.sm,
        borderBottomLeftRadius: theme.radius.sm,
      },

      "&:last-of-type": {
        borderTopRightRadius: theme.radius.sm,
        borderBottomRightRadius: theme.radius.sm,
      },
    },
  },
}));

export function ButtonsGroup({ children }: { children: any }) {
  const { classes } = useStyles();
  return (
    <Group className={classes.wrapper} grow spacing={0}>
      {children}
    </Group>
  );
}
