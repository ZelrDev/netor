import {
  BanIcon,
  ChatAlt2Icon,
  ExclamationCircleIcon,
  MinusIcon,
  XIcon,
} from "@heroicons/react/solid";
import {
  Table,
  Box,
  Text,
  Paper,
  ThemeIcon,
  Group,
  Tooltip,
  Avatar,
  ScrollArea,
  ActionIcon,
} from "@mantine/core";
import { useParams, Link } from "@remix-run/react";
import ReactTimeAgo from "react-time-ago";
import type { DBGuildMemberPunishments } from "~/models/dbGuildMember.server";
import type { APIGuildMember } from "~/api-requests/apiGuildMember.server";
import { ThemeChip } from "../../../ui/ThemeChip";
import type { APIUser } from "~/api-requests/apiUser.server";
import { useManageMember } from "./use-member";
import type { APIGuild } from "~/api-requests/apiGuild.server";
import { useTypeSafeTranslation } from "~/shared-hooks/use-type-safe-translation";
import { discordAvatar } from "~/lib/discordServerAvatar";

export const UserPunishmentTable = (props: {
  dbGuildMemberPunishments: DBGuildMemberPunishments;
  apiUser: APIUser;
  apiGuild: APIGuild;
  apiGuildMember?: APIGuildMember;
  banned: boolean;
}) => {
  const { t } = useTypeSafeTranslation();
  const params = useParams();
  const navigateURL = (id: string) => `/${params.guild}/users/${id}`;
  const { removePunishment, removeBan, removeMemberTimeout } = useManageMember(
    props.apiGuild,
    props.apiGuildMember ?? props.apiUser
  );

  const getTime = (
    days: string,
    hours: string,
    minutes: string,
    seconds: string
  ) => {
    let result: string = seconds + "s";
    if (!(minutes === "00" && hours === "00" && days === "00"))
      result = `${minutes}m ${result}`;
    if (!(hours === "00" && days === "00")) result = `${hours}h ${result}`;
    if (!(days === "00")) result = `${days}d ${result}`;

    return result
      .replace("0d", "")
      .replace("0h", "")
      .replace("0m", "")
      .replace("0s", "");
  };

  const determineActive = (
    type: "TIMEOUT" | "BAN" | "KICK",
    punishmentDate: Date
  ) => {
    if (type === "BAN") {
      return (
        props.dbGuildMemberPunishments.filter((x) => {
          if (x.type !== "BAN") return false;
          const xDate = new Date(x.date);
          xDate.setHours(xDate.getHours() - 1);
          return xDate.valueOf() > punishmentDate.valueOf();
        }).length < 1 && props.banned
      );
    }
    if (props.apiGuildMember && type === "TIMEOUT") {
      return (
        props.dbGuildMemberPunishments.filter((x) => {
          if (x.type !== "TIMEOUT") return false;
          const xDate = new Date(x.date);
          xDate.setHours(xDate.getHours() - 1);
          return xDate.valueOf() > punishmentDate.valueOf();
        }).length < 1 &&
        props.apiGuildMember.communication_disabled_until &&
        new Date().valueOf() <
          new Date(props.apiGuildMember.communication_disabled_until).valueOf()
      );
    }
  };

  const deactivate = (type: "TIMEOUT" | "BAN" | "KICK") => {
    if (type === "BAN") removeBan();
    if (type === "TIMEOUT") removeMemberTimeout();
  };

  return (
    <Paper my="md" shadow="md">
      <ScrollArea>
        <Table
          style={{ minWidth: 1200 }}
          highlightOnHover
          horizontalSpacing="xl"
          verticalSpacing="sm"
        >
          <thead>
            <tr>
              <th>{t("pages.punishmentHistory.type")}</th>
              <th>{t("pages.punishmentHistory.created")}</th>
              <th>{t("pages.punishmentHistory.duration")}</th>
              <th>{t("pages.punishmentHistory.reason")}</th>
              <th>{t("pages.punishmentHistory.punisher")}</th>
              <th>{t("pages.punishmentHistory.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {props.dbGuildMemberPunishments.map((punishment) => {
              const punishmentDate = new Date(punishment.date);
              punishmentDate.setHours(punishmentDate.getHours() - 1);
              const x = punishment.time;
              const duration = {
                days: x[0] + x[1],
                hours: x[3] + x[4],
                minutes: x[6] + x[7],
                seconds: x[9] + x[10],
              };

              return (
                <tr key={punishment.id}>
                  <td>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                      }}
                    >
                      <Group>
                        {punishment.type === "BAN" && (
                          <ThemeIcon color="red" variant="light">
                            <BanIcon style={{ padding: 2 }} />
                          </ThemeIcon>
                        )}
                        {punishment.type === "KICK" && (
                          <ThemeIcon color="orange" variant="light">
                            <ExclamationCircleIcon style={{ padding: 2 }} />
                          </ThemeIcon>
                        )}
                        {punishment.type === "TIMEOUT" && (
                          <ThemeIcon color="yellow" variant="light">
                            <ChatAlt2Icon style={{ padding: 2 }} />
                          </ThemeIcon>
                        )}
                        <Text
                          weight={700}
                          style={{ letterSpacing: "0.1em" }}
                          color="gray"
                          size="sm"
                        >
                          {punishment.type === "BAN" &&
                            t("discord.punishment.ban").toUpperCase()}
                          {punishment.type === "KICK" &&
                            t("discord.punishment.kick").toUpperCase()}
                          {punishment.type === "TIMEOUT" &&
                            t("discord.punishment.timeout").toUpperCase()}
                        </Text>
                        {determineActive(punishment.type, punishmentDate) && (
                          <ThemeChip
                            color="green"
                            text={t("pages.punishmentHistory.activeChip")}
                          />
                        )}
                      </Group>
                    </Box>
                  </td>
                  <td>
                    <Tooltip
                      label={punishmentDate.toLocaleString()}
                      withArrow
                      transition="pop"
                      transitionDuration={300}
                      transitionTimingFunction="ease"
                      gutter={10}
                    >
                      <Text style={{ cursor: "default" }}>
                        <ReactTimeAgo
                          tooltip={false}
                          date={punishmentDate}
                          timeStyle="twitter"
                        />
                      </Text>
                    </Tooltip>
                  </td>
                  <td>
                    <Text>
                      {punishment.time &&
                        getTime(
                          duration.days,
                          duration.hours,
                          duration.minutes,
                          duration.seconds
                        )}
                    </Text>
                  </td>
                  <td>
                    {punishment.reason.length > 36 ? (
                      <Tooltip
                        wrapLines
                        width={400}
                        transition="pop"
                        transitionDuration={300}
                        transitionTimingFunction="ease"
                        label={punishment.reason}
                      >
                        <Text>{punishment.reason.substring(0, 37)}...</Text>
                      </Tooltip>
                    ) : (
                      <Text>{punishment.reason}</Text>
                    )}
                  </td>
                  <td>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                      }}
                    >
                      <Group spacing="sm">
                        <Avatar
                          src={discordAvatar(
                            punishment.punisher?.id,
                            punishment.punisher?.avatar
                          )}
                          size="sm"
                          radius="xl"
                        />
                        <Tooltip
                          transition="pop"
                          transitionDuration={300}
                          transitionTimingFunction="ease"
                          label={
                            punishment.punisher?.username +
                            "#" +
                            punishment.punisher?.discriminator
                          }
                        >
                          <Text
                            variant="link"
                            to={navigateURL(punishment.punisher_id)}
                            component={Link}
                            color="indigo"
                            size="sm"
                          >
                            {punishment?.punisher?.username}
                          </Text>
                        </Tooltip>
                      </Group>
                    </Box>
                  </td>
                  <td>
                    <Box style={{ display: "flex", alignItems: "center" }}>
                      {determineActive(punishment.type, punishmentDate) ? (
                        <Tooltip
                          transition="pop"
                          transitionDuration={300}
                          transitionTimingFunction="ease"
                          label={`${
                            punishment.type === "BAN"
                              ? t("pages.punishmentHistory.actionDeactivateBan")
                              : ""
                          }${
                            punishment.type === "TIMEOUT"
                              ? t(
                                  "pages.punishmentHistory.actionDeactivateTimeout"
                                )
                              : ""
                          }`}
                        >
                          <ActionIcon
                            onClick={() => deactivate(punishment.type)}
                            variant="light"
                            color="yellow"
                            size="sm"
                          >
                            <MinusIcon />
                          </ActionIcon>
                        </Tooltip>
                      ) : (
                        <Tooltip
                          transition="pop"
                          transitionDuration={300}
                          transitionTimingFunction="ease"
                          label={t("pages.punishmentHistory.actionRemove")}
                        >
                          <ActionIcon
                            onClick={() => removePunishment(punishment.id)}
                            variant="light"
                            color="red"
                            size="sm"
                          >
                            <XIcon />
                          </ActionIcon>
                        </Tooltip>
                      )}
                    </Box>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </ScrollArea>
    </Paper>
  );
};
