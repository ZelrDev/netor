import { Box, Paper, Text, Title, useMantineTheme } from "@mantine/core";
import { useHover } from "@mantine/hooks";
import { useNavigate } from "@remix-run/react";

interface PluginCardProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  title: string;
  link: string;
  description: string;
  Icon: any;
}

export const PluginCard = ({
  title,
  link,
  description,
  className,
  Icon,
  ...props
}: PluginCardProps) => {
  const { hovered, ref } = useHover();
  const navigate = useNavigate();
  const theme = useMantineTheme();
  return (
    <Paper
      ref={ref}
      onClick={() => {
        navigate(link);
      }}
      shadow="sm"
      sx={(theme) => ({
        cursor: "pointer",
        "&:hover": {
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.indigo[9]
              : theme.colors.indigo[0],
          transform: "translateY(-0.25rem)",
        },
        transitionProperty: "all",
        transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
        transitionDuration: "150ms",
        backgroundColor:
          theme.colorScheme === "dark"
            ? theme.colors.dark[8]
            : theme.colors.gray[0],
      })}
      radius="md"
    >
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Box
          sx={(theme) => ({
            flex: "none",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor:
              theme.colorScheme === "dark"
                ? theme.colors.dark[8]
                : theme.colors.gray[0],
            borderRight: "solid 1px",
            borderRightColor:
              theme.colorScheme === "dark"
                ? theme.colors.dark[8]
                : theme.colors.gray[2],
            ...(hovered && {
              backgroundColor:
                theme.colorScheme === "dark"
                  ? theme.colors.indigo[8]
                  : theme.colors.indigo[1],
            }),
            transitionProperty: "all",
            transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
            transitionDuration: "150ms",
            borderTopLeftRadius: theme.radius.md,
            borderBottomLeftRadius: theme.radius.md,
          })}
          p="sm"
        >
          <Box
            sx={{
              height: "6rem",
              width: "6rem",
            }}
          >
            <Icon
              style={{
                ...(hovered && {
                  color:
                    theme.colorScheme === "dark" ? theme.white : theme.black,
                  transitionProperty: "all",
                  transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
                  transitionDuration: "150ms",
                }),
              }}
            />
          </Box>
        </Box>
        <Box
          sx={{
            flexGrow: 1,
          }}
          px="md"
        >
          <Title
            sx={(theme) => ({
              [`@media (max-width: ${theme.breakpoints.xs}px)`]: {
                fontSize: theme.headings.sizes.h4.fontSize,
              },
            })}
            order={3}
          >
            {title}
          </Title>
          <Text
            sx={(theme) => ({
              [`@media (max-width: ${theme.breakpoints.xs}px)`]: {
                fontSize: theme.fontSizes.sm,
              },
            })}
          >
            {description}
          </Text>
        </Box>
      </Box>
    </Paper>
  );
};
