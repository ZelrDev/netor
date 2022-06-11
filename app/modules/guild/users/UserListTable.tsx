import {
  Table,
  Box,
  Text,
  Paper,
  Avatar,
  ScrollArea,
  Tooltip,
} from "@mantine/core";
import { useParams, Link, useNavigate } from "@remix-run/react";
import ReactTimeAgo from "react-time-ago";
import type { APIGuild } from "~/api-requests/apiGuild.server";
import type {
  APIGuildBannedMembers,
  APIGuildMembers,
} from "~/api-requests/apiGuildMembers.server";
import type { APIGuildRoles } from "~/api-requests/apiGuildRoles.server";
import { discordAvatar } from "~/lib/discordServerAvatar";
import { useTypeSafeTranslation } from "~/shared-hooks/use-type-safe-translation";

import { ThemeChip } from "../../../ui/ThemeChip";

export const UserTable = (props: {
  users: APIGuildMembers;
  guild: APIGuild;
  bannedUsers: APIGuildBannedMembers;
  roles: APIGuildRoles;
}) => {
  const params = useParams();
  const { t } = useTypeSafeTranslation();
  const navigateURL = (id: string) => `/${params.guild}/users/${id}`;
  const navigate = useNavigate();

  return (
    <Paper shadow="md">
      <ScrollArea>
        <Table
          style={{ minWidth: 500 }}
          highlightOnHover
          horizontalSpacing="xl"
          verticalSpacing="sm"
        >
          <thead>
            <tr>
              <th>{t("pages.users.table.name")}</th>
              <th>{t("pages.users.table.status")}</th>
              <th>{t("pages.users.table.joined")}</th>
              <th>{t("pages.users.table.role")}</th>
              <th>{t("pages.users.table.edit")}</th>
            </tr>
          </thead>
          <tbody>
            {props.users.map((user) => {
              const roles = props.roles.filter((role) =>
                user.roles.includes(role.id)
              ) || [{ name: "" }];

              return (
                <tr
                  style={{ cursor: "pointer" }}
                  onClick={() =>
                    navigate(navigateURL(user.user!.id) + "/overview")
                  }
                  key={user.user!.id}
                >
                  <td>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                      }}
                    >
                      <Avatar
                        radius="xl"
                        size="md"
                        src={discordAvatar(user.user?.id, user.user?.avatar)}
                        alt=""
                      />
                      <Box>
                        <Text>{user.user!.username}</Text>
                        <Text color="gray" size="xs">
                          #{user.user!.discriminator}
                        </Text>
                      </Box>
                      {props.guild.owner_id === user.user!.id && (
                        <Box style={{ display: "flex" }}>
                          <ThemeChip
                            color="indigo"
                            text={t("pages.users.statusOwner")}
                          />
                        </Box>
                      )}
                    </Box>
                  </td>
                  <td>
                    <Box style={{ display: "flex" }}>
                      <ThemeChip
                        color="green"
                        text={t("pages.users.statusJoined")}
                      />
                    </Box>
                  </td>
                  <td>
                    <Tooltip
                      label={new Date(user.joined_at).toLocaleString()}
                      withArrow
                      transition="pop"
                      transitionDuration={300}
                      transitionTimingFunction="ease"
                      gutter={10}
                    >
                      <Text style={{ cursor: "default" }}>
                        <ReactTimeAgo
                          tooltip={false}
                          date={new Date(user.joined_at)}
                          timeStyle="twitter"
                        />
                      </Text>
                    </Tooltip>
                  </td>
                  <td>
                    {roles[0] && (
                      <Box style={{ display: "flex" }}>
                        <ThemeChip
                          customColor={"#" + roles[0].color.toString(16)}
                          text={roles[0].name.toUpperCase()}
                        />
                      </Box>
                    )}
                  </td>
                  <td>
                    <Text
                      variant="link"
                      to={navigateURL(user.user!.id) + "/overview"}
                      component={Link}
                      color="indigo"
                    >
                      {t("pages.users.view")}
                    </Text>
                  </td>
                </tr>
              );
            })}
            {props.bannedUsers.map((user) => {
              return (
                <tr
                  style={{ cursor: "pointer" }}
                  onClick={() =>
                    navigate(navigateURL(user.user!.id) + "/punishment-history")
                  }
                  key={user.user!.id}
                >
                  <td>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                      }}
                    >
                      <Avatar
                        radius="xl"
                        size="md"
                        src={discordAvatar(user.user?.id, user.user?.avatar)}
                        alt=""
                      />
                      <Box>
                        <Text>{user.user!.username}</Text>
                        <Text color="gray" size="xs">
                          #{user.user!.discriminator}
                        </Text>
                      </Box>
                    </Box>
                  </td>
                  <td>
                    <Box style={{ display: "flex" }}>
                      <ThemeChip
                        color="red"
                        text={t("pages.users.statusBanned")}
                      />
                    </Box>
                  </td>
                  <td></td>
                  <td></td>
                  <td>
                    <Text
                      variant="link"
                      to={navigateURL(user.user!.id + "/punishment-history")}
                      component={Link}
                      color="indigo"
                    >
                      {t("pages.users.history")}
                    </Text>
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
