import {
  BanIcon,
  ExclamationCircleIcon,
  ChatAlt2Icon,
} from "@heroicons/react/solid";
import {
  Box,
  Button,
  Input,
  Modal,
  Paper,
  Stack,
  Tabs,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { DatePicker, TimeInput } from "@mantine/dates";
import { useForm } from "@mantine/hooks";
import { useState } from "react";
import type { DBGuildMemberPunishmentsRAW } from "~/models/dbGuildMember.server";
import type { APIGuild } from "~/api-requests/apiGuild.server";
import type { APIGuildMember } from "~/api-requests/apiGuildMember.server";
import { StyledTabs } from "../../../ui/Tabs";
import { useManageMember } from "./use-member";
import { calculatePunishmentButtonsTimeout } from "~/lib/calculatePunishmentButtonsTimeout";
import { useTypeSafeTranslation } from "~/shared-hooks/use-type-safe-translation";

export const PunishmentButtons = (props: {
  apiGuildMember: APIGuildMember;
  apiGuild: APIGuild;
  dbGuildMemberPunishmentsRAW: DBGuildMemberPunishmentsRAW;
}) => {
  const { timeoutMember, kickMember, banMember } = useManageMember(
    props.apiGuild,
    props.apiGuildMember
  );
  const { apiGuildMember, dbGuildMemberPunishmentsRAW } = props;
  const [activeTab, setActiveTab] = useState(0);
  const [opened, setOpened] = useState(false);
  const [punishment, setPunishment] = useState<string>("");
  const { t } = useTypeSafeTranslation();
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const form = useForm({
    initialValues: {
      time: new Date(),
      date: new Date(),
      reason: "",
    },
  });

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
      title: t("discord.punishment.timeouts"),
      value: dbGuildMemberPunishmentsRAW.filter((x) => x.type === "TIMEOUT")
        .length,
      buttonText: t("pages.user.actions.timeoutUser"),
      buttonOnClick: () =>
        handlePunishment({
          title:
            t("pages.user.actions.dialogs.timeout.title") +
            "'" +
            apiGuildMember.user!.username +
            "'",
          description:
            t("pages.user.actions.dialogs.timeout.desc") +
            "'" +
            apiGuildMember.user!.username +
            "'",
          punishment: "timeout",
        }),
      colorScheme: "yellow",
    },
    {
      icon: ExclamationCircleIcon,
      title: t("discord.punishment.kicks"),
      value: dbGuildMemberPunishmentsRAW.filter((x) => x.type === "KICK")
        .length,
      buttonText: t("pages.user.actions.kickUser"),
      buttonOnClick: () =>
        handlePunishment({
          title:
            t("pages.user.actions.dialogs.kick.title") +
            "'" +
            apiGuildMember.user!.username +
            "'",
          description:
            t("pages.user.actions.dialogs.kick.desc") +
            "'" +
            apiGuildMember.user!.username +
            "'",
          punishment: "kick",
        }),
      colorScheme: "orange",
    },
    {
      icon: BanIcon,
      title: t("discord.punishment.bans"),
      value: dbGuildMemberPunishmentsRAW.filter((x) => x.type === "BAN").length,
      buttonText: t("pages.user.actions.banUser"),
      buttonOnClick: () =>
        handlePunishment({
          title:
            t("pages.user.actions.dialogs.ban.title") +
            "'" +
            apiGuildMember.user!.username +
            "'",
          description:
            t("pages.user.actions.dialogs.ban.desc") +
            "'" +
            apiGuildMember.user!.username +
            "'",
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
            if (punishment === "ban") banMember(values.reason);
            if (punishment === "kick") kickMember(values.reason);
            if (punishment === "timeout")
              timeoutMember(
                calculatePunishmentButtonsTimeout(
                  activeTab,
                  values.date,
                  values.time
                ).toString(),
                values.reason
              );

            setOpened(false);
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
                    <Tabs.Tab
                      label={t("pages.user.actions.dialogs.timeout.tabs.60s")}
                    />
                    <Tabs.Tab
                      label={t("pages.user.actions.dialogs.timeout.tabs.5m")}
                    />
                    <Tabs.Tab
                      label={t("pages.user.actions.dialogs.timeout.tabs.10m")}
                    />
                    <Tabs.Tab
                      label={t("pages.user.actions.dialogs.timeout.tabs.1h")}
                    />
                    <Tabs.Tab
                      label={t("pages.user.actions.dialogs.timeout.tabs.1d")}
                    />
                    <Tabs.Tab
                      label={t("pages.user.actions.dialogs.timeout.tabs.1w")}
                    />
                    <Tabs.Tab
                      label={t(
                        "pages.user.actions.dialogs.timeout.tabs.custom.name"
                      )}
                    />
                  </StyledTabs>
                  {activeTab === 6 && (
                    <Box style={{ display: "flex", gap: 7 }}>
                      <DatePicker
                        placeholder={t("placeholders.pickDate")}
                        label={t(
                          "pages.user.actions.dialogs.timeout.tabs.custom.endDate"
                        )}
                        minDate={new Date()}
                        maxDate={discordTimeoutLimit}
                        required
                        {...form.getInputProps("date")}
                        style={{ width: "100%" }}
                      />
                      <TimeInput
                        label={t(
                          "pages.user.actions.dialogs.timeout.tabs.custom.endTime"
                        )}
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
                placeholder={t("pages.user.actions.dialogs.generic.reason")}
              />
              <Button
                onClick={() => {
                  setOpened(false);
                }}
                variant="default"
              >
                {t("common.cancel")}
              </Button>
              <Button type="submit" color="red">
                {t("common.confirm")}
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
              theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
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
