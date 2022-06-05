import {
  BanIcon,
  ExclamationCircleIcon,
  ChatAlt2Icon,
} from "@heroicons/react/solid";
import {
  Box,
  Button,
  Group,
  Input,
  Modal,
  Paper,
  Stack,
  Tabs,
  Text,
  ThemeIcon,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { DatePicker, TimeInput } from "@mantine/dates";
import { useForm } from "@mantine/hooks";
import { useModals } from "@mantine/modals";
import {
  useLoaderData,
  useLocation,
  useNavigate,
  useParams,
  useSubmit,
} from "@remix-run/react";
import { useState } from "react";
import { openError } from "~/hooks/openError";
import { DBGuild } from "~/models/dbGuild.server";
import {
  DBGuildMemberPunishments,
  DBGuildMemberPunishmentsRAW,
} from "~/models/dbGuildPunishments.server";
import { APIGuild } from "~/requests/apiGuild.server";
import { APIGuildMember } from "~/requests/apiGuildMember.server";
import { StyledTabs } from "../Tabs";

function combineDateWithTime(d: Date, t: Date) {
  return new Date(
    d.getFullYear(),
    d.getMonth(),
    d.getDate(),
    t.getHours(),
    t.getMinutes(),
    t.getSeconds(),
    t.getMilliseconds()
  );
}

type LoaderData = {
  dbGuild: DBGuild;
  apiGuild: APIGuild;
  apiGuildMember: APIGuildMember;
  dbGuildMemberPunishmentsRAW: DBGuildMemberPunishmentsRAW;
};

export const PunishmentButtons = () => {
  const { apiGuildMember, dbGuildMemberPunishmentsRAW } =
    useLoaderData() as LoaderData;
  const modals = useModals();
  const navigate = useNavigate();
  const params = useParams();
  const { pathname } = useLocation();
  const [activeTab, setActiveTab] = useState(0);
  const [opened, setOpened] = useState(false);
  const [punishment, setPunishment] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const theme = useMantineTheme();
  const form = useForm({
    initialValues: {
      time: new Date(),
      date: new Date(),
      reason: "",
    },
  });
  const submit = useSubmit();

  const handlePunishment = (type: {
    punishment: string;
    title: string;
    description: string;
  }) => {
    setTitle(type.title);
    setDescription(type.description);
    setPunishment(type.punishment);
    setOpened(true);
  };

  const discordTimeoutLimit = new Date();
  discordTimeoutLimit.setDate(discordTimeoutLimit.getDate() + 27);

  const punishmentsCards = [
    {
      icon: ChatAlt2Icon,
      title: "Timeouts",
      value: dbGuildMemberPunishmentsRAW.filter((x) => x.type === "TIMEOUT")
        .length,
      buttonText: "Timeout User",
      buttonOnClick: () =>
        handlePunishment({
          title:
            "Are you sure you would timeout '" +
            apiGuildMember.user!.username +
            "'",
          description:
            "This action is irreversible and you can not go back. Are you sure you would like to timeout " +
            apiGuildMember.user!.username,
          punishment: "timeout",
        }),
      colorScheme: "yellow",
    },
    {
      icon: ExclamationCircleIcon,
      title: "Kicks",
      value: dbGuildMemberPunishmentsRAW.filter((x) => x.type === "KICK")
        .length,
      buttonText: "Kick User",
      buttonOnClick: () =>
        handlePunishment({
          title:
            "Are you sure you would kick '" +
            apiGuildMember.user!.username +
            "'",
          description:
            "This action is irreversible and you can not go back. Are you sure you would like to kick " +
            apiGuildMember.user!.username,
          punishment: "kick",
        }),
      colorScheme: "orange",
    },
    {
      icon: BanIcon,
      title: "Bans",
      value: dbGuildMemberPunishmentsRAW.filter((x) => x.type === "BAN").length,
      buttonText: "Ban User",
      buttonOnClick: () =>
        handlePunishment({
          title:
            "Are you sure you would ban '" +
            apiGuildMember.user!.username +
            "'",
          description:
            "This action is irreversible and you can not go back. Are you sure you would like to ban " +
            apiGuildMember.user!.username,
          punishment: "ban",
        }),
      colorScheme: "red",
    },
  ];

  return (
    <>
      <Modal
        size="lg"
        centered
        opened={opened}
        onClose={() => setOpened(false)}
        title={title}
      >
        <form
          onSubmit={form.onSubmit((values) => {
            let formData = new FormData();
            formData.append("user_id", apiGuildMember.user!.id);
            formData.append(
              "reason",
              values.reason === "" ? "No reason specified" : values.reason
            );
            formData.append(punishment, "true");
            if (punishment === "timeout") {
              let punishmentMS = Date.now();

              switch (activeTab) {
                case 0:
                  punishmentMS = Date.now() + 60000;
                  break;
                case 1:
                  punishmentMS = Date.now() + 300000;
                  break;
                case 2:
                  punishmentMS = Date.now() + 600000;
                  break;
                case 3:
                  punishmentMS = Date.now() + 3.6e6;
                  break;
                case 4:
                  punishmentMS = Date.now() + 8.64e7;
                  break;
                case 5:
                  punishmentMS = Date.now() + 6.048e8;
                  break;
                case 6:
                  const date = combineDateWithTime(values.date, values.time);
                  punishmentMS = date.valueOf();
                  break;
                default:
                  punishmentMS = Date.now();
              }

              formData.append("time", punishmentMS.toString());
            }

            setOpened(false);
            submit(formData, { method: "post" });
          })}
        >
          <Stack>
            <Stack>
              <Text size="sm">{description}</Text>
              {punishment == "timeout" && (
                <Stack>
                  <StyledTabs
                    active={activeTab}
                    onTabChange={setActiveTab}
                    grow
                  >
                    <Tabs.Tab label="60 SECS" />
                    <Tabs.Tab label="5 MINS" />
                    <Tabs.Tab label="10 MINS" />
                    <Tabs.Tab label="1 HOUR" />
                    <Tabs.Tab label="1 DAY" />
                    <Tabs.Tab label="1 WEEK" />
                    <Tabs.Tab label="CUSTOM" />
                  </StyledTabs>
                  {activeTab === 6 && (
                    <Box style={{ display: "flex", gap: 7 }}>
                      <DatePicker
                        placeholder="Pick date"
                        label="End date"
                        minDate={new Date()}
                        maxDate={discordTimeoutLimit}
                        required
                        {...form.getInputProps("date")}
                        style={{ width: "100%" }}
                      />
                      <TimeInput
                        label="End time"
                        style={{ width: "100%" }}
                        {...form.getInputProps("time")}
                        required
                      />
                    </Box>
                  )}
                </Stack>
              )}
            </Stack>
            <Box sx={{ display: "flex", gap: 10, paddingTop: 20 }}>
              <Input
                {...form.getInputProps("reason")}
                style={{ width: "100%" }}
                variant="filled"
                placeholder="Reason"
              />
              <Button
                onClick={() => {
                  setOpened(false);
                }}
                variant="default"
              >
                Cancel
              </Button>
              <Button type="submit" color="red">
                Confirm
              </Button>
            </Box>
          </Stack>
        </form>
      </Modal>
      {punishmentsCards.map((card, idx) => (
        <Paper
          key={idx}
          shadow="sm"
          sx={(theme) => ({
            backgroundColor:
              theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.white,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            minWidth: 150,
            minHeight: 137,
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
              <ThemeIcon variant="light" color={card.colorScheme} size="sm">
                <card.icon />
              </ThemeIcon>
              <Text
                weight={700}
                size="sm"
                style={{ letterSpacing: "0.1em" }}
                color="gray"
              >
                {card.title.toUpperCase()}
              </Text>
            </Box>
            <Title>{card.value}</Title>

            <Button
              onClick={card.buttonOnClick}
              color={card.colorScheme}
              variant="light"
              leftIcon={<card.icon width={20} />}
            >
              {card.buttonText}
            </Button>
          </Stack>
        </Paper>
      ))}
    </>
  );
};
