import {
  BanIcon,
  ChatAlt2Icon,
  ExclamationCircleIcon,
  MinusIcon,
  XIcon,
} from "@heroicons/react/solid";
import {
  Table,
  Image,
  Stack,
  Box,
  Text,
  Button,
  Paper,
  ThemeIcon,
  Group,
  Tooltip,
  Avatar,
  ScrollArea,
  ActionIcon,
  Center,
  Chip,
} from "@mantine/core";
import {
  useParams,
  Link,
  useLocation,
  useNavigate,
  useSubmit,
} from "@remix-run/react";
import ReactTimeAgo from "react-time-ago";
import { DBGuildMemberPunishments } from "~/models/dbGuildPunishments.server";
import { openError } from "~/hooks/openError";
import { useModals } from "@mantine/modals";
import { APIGuildMember } from "~/requests/apiGuildMember.server";
import { ThemeChip } from "../ThemeChip";
import { APIUser } from "~/requests/apiUser";
import { APIGuildMembers } from "~/requests/apiGuildMembers.server";
import { discordAvatar } from "~/utils";

export const UserPunishmentTable = (props: {
  punishments: DBGuildMemberPunishments;
  user: APIUser;
  member?: APIGuildMember;
  banned: boolean;
}) => {
  const params = useParams();
  const modals = useModals();
  const { pathname } = useLocation();
  const navigateURL = (id: string) => `/${params.guild}/users/${id}`;
  const navigate = useNavigate();
  const submit = useSubmit();

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
        props.punishments.filter((x) => {
          if (x.type !== "BAN") return false;
          const xDate = new Date(x.date);
          xDate.setHours(xDate.getHours() - 1);
          return xDate.valueOf() > punishmentDate.valueOf();
        }).length < 1 && props.banned
      );
    }
    if (props.member && type === "TIMEOUT") {
      return (
        props.punishments.filter((x) => {
          if (x.type !== "TIMEOUT") return false;
          const xDate = new Date(x.date);
          xDate.setHours(xDate.getHours() - 1);
          return xDate.valueOf() > punishmentDate.valueOf();
        }).length < 1 &&
        props.member.communication_disabled_until &&
        new Date().valueOf() <
          new Date(props.member.communication_disabled_until).valueOf()
      );
    }
  };

  const deactivate = (type: "TIMEOUT" | "BAN" | "KICK") => {
    if (type !== "KICK") {
      let formData = new FormData();
      formData.append("user_id", props.user!.id);
      formData.append("remove_" + type.toLowerCase(), "true");
      submit(formData, { method: "post" });
    }
  };

  const removePunishment = (id: string) => {
    const formData = new FormData();
    formData.append("remove_punishment", "true");
    formData.append("punishment_id", id);
    submit(formData, { method: "post" });
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
              <th>Type</th>
              <th>Created</th>
              <th>Duration</th>
              <th>Reason</th>
              <th>Punisher</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {props.punishments.map((punishment) => {
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
                          {punishment.type}
                        </Text>
                        {determineActive(punishment.type, punishmentDate) && (
                          <ThemeChip color="green" text="ACTIVE" />
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
                          label={`Deactivate ${punishment.type.toLowerCase()}`}
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
                          label="Remove punishment from user's record"
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
