import { APIGuildMember } from "~/requests/apiGuildMember.server";
import Countdown from "react-countdown";
import {
  Box,
  Button,
  Paper,
  Stack,
  Text,
  ThemeIcon,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { ChatAlt2Icon, XIcon } from "@heroicons/react/solid";
import {
  useActionData,
  useFetcher,
  useLocation,
  useNavigate,
  useSubmit,
  useTransition,
} from "@remix-run/react";
import { openError } from "~/hooks/openError";
import { useModals } from "@mantine/modals";

export const CurrentTimeout = (props: { member: APIGuildMember }) => {
  const timedOut = props.member.communication_disabled_until !== null;
  const data = useSubmit();

  const removeTimeout = () => {
    let formData = new FormData();
    formData.append("user_id", props.member.user!.id);
    formData.append("remove_timeout", "true");
    data(formData, { method: "post" });
  };

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
                  ? theme.colors.dark[8]
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
                  CURRENT TIMEOUT
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
              <Button
                leftIcon={<XIcon width={20} />}
                color="orange"
                variant="light"
                onClick={removeTimeout}
              >
                Remove
              </Button>
            </Stack>
          </Paper>
        ) : null
      }
      date={new Date(props.member.communication_disabled_until!).toString()}
    />
  ) : null;
};
