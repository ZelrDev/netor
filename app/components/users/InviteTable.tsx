import { XIcon } from "@heroicons/react/solid";
import {
  Table,
  Box,
  Text,
  Paper,
  Group,
  Tooltip,
  Avatar,
  ScrollArea,
  ActionIcon,
} from "@mantine/core";
import { useParams, Link, useSubmit } from "@remix-run/react";
import ReactTimeAgo from "react-time-ago";
import type { DBGuildMemberInvites } from "~/models/dbGuildMember.server";
import type { APIGuildMember } from "~/requests/apiGuildMember.server";
import { ThemeChip } from "../ThemeChip";
import type { APIUser } from "~/requests/apiUser";
import { discordAvatar } from "~/utils";

export const InviteTable = (props: {
  invites: DBGuildMemberInvites;
  user: APIUser;
  member?: APIGuildMember;
}) => {
  const params = useParams();
  const navigateURL = (id: string) => `/${params.guild}/users/${id}`;
  const submit = useSubmit();

  const removeInvite = (invite_id: string) => {
    let formData = new FormData();
    formData.append("remove_invite", "true");
    formData.append("invite_id", invite_id);
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
              <th>Member</th>
              <th>Created</th>
              <th>Valid</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {props.invites.map((invite) => {
              const inviteDate = new Date(invite.date_created);
              inviteDate.setHours(inviteDate.getHours() - 1);

              return (
                <tr key={invite.id}>
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
                            invite.joined?.id,
                            invite.joined?.avatar
                          )}
                          size="sm"
                          radius="xl"
                        />
                        <Tooltip
                          transition="pop"
                          transitionDuration={300}
                          transitionTimingFunction="ease"
                          label={
                            invite.joined?.username +
                            "#" +
                            invite.joined?.discriminator
                          }
                        >
                          <Text
                            variant="link"
                            to={navigateURL(invite.joined_id)}
                            component={Link}
                            color="indigo"
                            size="sm"
                          >
                            {invite.joined?.username}
                          </Text>
                        </Tooltip>
                      </Group>
                    </Box>
                  </td>
                  <td>
                    <Tooltip
                      label={inviteDate.toLocaleString()}
                      withArrow
                      transition="pop"
                      transitionDuration={300}
                      transitionTimingFunction="ease"
                      gutter={10}
                    >
                      <Text style={{ cursor: "default" }}>
                        <ReactTimeAgo
                          tooltip={false}
                          date={inviteDate}
                          timeStyle="twitter"
                        />
                      </Text>
                    </Tooltip>
                  </td>

                  <td>
                    <Group>
                      {invite.valid ? (
                        <ThemeChip color="green" text="VALID" />
                      ) : (
                        <ThemeChip color="red" text="INVALID" />
                      )}
                    </Group>
                  </td>
                  <td>
                    <Box style={{ display: "flex", alignItems: "center" }}>
                      <Tooltip
                        transition="pop"
                        transitionDuration={300}
                        transitionTimingFunction="ease"
                        label="Remove invite from user's history"
                      >
                        <ActionIcon
                          onClick={() => removeInvite(invite.id)}
                          variant="light"
                          color="red"
                          size="sm"
                        >
                          <XIcon />
                        </ActionIcon>
                      </Tooltip>
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
