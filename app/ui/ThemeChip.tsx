import { Box, Text } from "@mantine/core";

function hexToRGBA(hex: string, opacity: number) {
 if (hex === "#0") {
    return "rgba(0, 0, 0, " + opacity / 2 + ")";
  }
  return (
    "rgba(" +
    (hex = hex.replace("#", ""))
      .match(new RegExp("(.{" + hex.length / 3 + "})", "g"))
      ?.map(function (l) {
        return parseInt(hex.length % 2 ? l + l : l, 16);
      })
      .concat(isFinite(opacity) ? opacity : 1)
      .join(",") +
    ")"
  );
}

export const ThemeChip = (props: {
  color?: string;
  text: string;
  customColor?: string;
}) => {
  return (
    <Box
      sx={(theme) => ({
        backgroundColor:
          theme.colorScheme === "dark"
            ? theme.colors.dark[9]
            : props.color
            ? theme.colors[props.color][1]
            : hexToRGBA(props.customColor!, 0.2),
        borderRadius: 999999,
        paddingLeft: theme.spacing.sm,
        paddingRight: theme.spacing.sm,
      })}
    >
      <Text
        weight={700}
        style={{
          letterSpacing: "0.075em",
          color: props.color ? undefined : props.customColor,
        }}
        color={props.color}
        size="xs"
      >
        {props.text}
      </Text>
    </Box>
  );
};
