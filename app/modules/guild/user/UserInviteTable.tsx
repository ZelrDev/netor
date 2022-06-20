import {
  Table,
  Box,
  Text,
  Paper,
  Group,
  Tooltip,
  Avatar,
  ScrollArea,
} from "@mantine/core";
import { useParams, Link } from "@remix-run/react";
import ReactTimeAgo from "react-time-ago";
import type {
  DBGuildMemberInvite,
  DBGuildMemberInvites,
} from "~/models/dbGuildMember.server";
import type { APIGuildMember } from "~/api-requests/apiGuildMember.server";
import { ThemeChip } from "../../../ui/ThemeChip";
import type { APIUser } from "~/api-requests/apiUser.server";
import type { ReactElement } from "react";
import { useTypeSafeTranslation } from "~/shared-hooks/use-type-safe-translation";
import { discordAvatar } from "~/lib/discordServerAvatar";

export const InviteTable = (props: {
  invites: DBGuildMemberInvites;
  user: APIUser;
  member?: APIGuildMember;
  actions: (props: { invite: DBGuildMemberInvite }) => ReactElement<any, any>;
}) => {
  const params = useParams();
  const { t } = useTypeSafeTranslation();
  const navigateURL = (id: string) => `/${params.guild}/users/${id}`;

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
              <th>{t("pages.inviteHistory.member")}</th>
              <th>{t("pages.inviteHistory.created")}</th>
              <th>{t("pages.inviteHistory.valid")}</th>
              <th>{t("pages.inviteHistory.actions")}</th>
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
                        <ThemeChip
                          color="green"
                          text={t("pages.inviteHistory.validChip")}
                        />
                      ) : (
                        <ThemeChip
                          color="red"
                          text={t("pages.inviteHistory.invalidChip")}
                        />
                      )}
                    </Group>
                  </td>
                  <td>
                    <Box style={{ display: "flex", alignItems: "center" }}>
                      <props.actions invite={invite} />
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
