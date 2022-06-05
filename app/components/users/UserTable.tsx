import {
  Table,
  Box,
  Text,
  Paper,
  Avatar,
  ScrollArea,
  Tooltip,
} from "@mantine/core";
import { useParams, Link } from "@remix-run/react";
import ReactTimeAgo from "react-time-ago";
import type { APIGuild } from "~/requests/apiGuild.server";
import type {
  APIGuildBannedMembers,
  APIGuildMembers,
} from "~/requests/apiGuildMembers.server";
import type { APIGuildRoles } from "~/requests/apiGuildRoles.server";
import { discordAvatar } from "~/utils";

import { ThemeChip } from "../ThemeChip";

export const UserTable = (props: {
  users: APIGuildMembers;
  guild: APIGuild;
  bannedUsers: APIGuildBannedMembers;
  roles: APIGuildRoles;
}) => {
  const params = useParams();

  const navigateURL = (id: string) => `/${params.guild}/users/${id}`;

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
              <th>Name</th>
              <th>Status</th>
              <th>Joined</th>
              <th>Role</th>
              <th>Edit</th>
            </tr>
          </thead>
          <tbody>
            {props.users.map((user) => {
              const roles = props.roles.filter((role) =>
                user.roles.includes(role.id)
              ) || [{ name: "" }];

              return (
                <tr key={user.user!.id}>
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
                          <ThemeChip color="indigo" text="OWNER" />
                        </Box>
                      )}
                    </Box>
                  </td>
                  <td>
                    <Box style={{ display: "flex" }}>
                      <ThemeChip color="green" text="JOINED" />
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
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    <Text
                      variant="link"
                      to={navigateURL(user.user!.id) + "/overview"}
                      component={Link}
                      color="indigo"
                    >
                      View
                    </Text>
                  </td>
                </tr>
              );
            })}
            {props.bannedUsers.map((user) => {
              return (
                <tr key={user.user!.id}>
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
                      <ThemeChip color="red" text="BANNED" />
                    </Box>
                  </td>
                  <td></td>
                  <td></td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    <Text
                      variant="link"
                      to={navigateURL(user.user!.id + "/punishment-history")}
                      component={Link}
                      color="indigo"
                    >
                      History
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
