import type { APIGuildMember } from "~/api-requests/apiGuildMember.server";
import Countdown from "react-countdown";
import { Box, Paper, Stack, Text, ThemeIcon, Title } from "@mantine/core";
import { ChatAlt2Icon } from "@heroicons/react/solid";
import { useTypeSafeTranslation } from "~/shared-hooks/use-type-safe-translation";

export const CurrentTimeout = (props: {
  apiGuildMember: APIGuildMember;
  children?: React.ReactNode;
}) => {
  const { t } = useTypeSafeTranslation();
  const timedOut = props.apiGuildMember.communication_disabled_until !== null;

  const getCountdown = (
    days: string,
    hours: string,
    minutes: string,
    seconds: string
  ) => {
    let result: string = seconds;
    if (!(minutes === "00" && hours === "00" && days === "00"))
      result = `${minutes}:${result}`;
    if (!(hours === "00" && days === "00")) result = `${hours}:${result}`;
    if (!(days === "00")) result = `${days}:${result}`;

    return result;
  };

  return timedOut ? (
    <Countdown
      renderer={({ days, hours, minutes, seconds, formatted }) =>
        minutes || seconds || hours || days ? (
          <Paper
            shadow="sm"
            sx={(theme) => ({
              backgroundColor:
                theme.colorScheme === "dark"
                  ? theme.colors.dark[7]
                  : theme.colors.white,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            })}
            radius="md"
            p="md"
          >
            <Stack spacing={10}>
              <Box
                style={{
                  display: "flex",
                  gap: 10,
                  alignItems: "center",
                }}
              >
                <ThemeIcon variant="light" size="sm" color="orange">
                  <ChatAlt2Icon />
                </ThemeIcon>
                <Text
                  weight={700}
                  size="sm"
                  style={{ letterSpacing: "0.1em" }}
                  color="gray"
                >
                  {t("pages.user.currentTimeout")}
                </Text>
              </Box>
              <Title>
                {getCountdown(
                  formatted.days,
                  formatted.hours,
                  formatted.minutes,
                  formatted.seconds
                )}
              </Title>
              {props?.children}
            </Stack>
          </Paper>
        ) : null
      }
      date={new Date(
        props.apiGuildMember.communication_disabled_until!
      ).toString()}
    />
  ) : null;
};
