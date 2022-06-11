import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { getSession } from "~/modules/auth/sessions.server";
import { ActionIcon, Tooltip } from "@mantine/core";
import type { DBGuildMemberInvites } from "~/models/dbGuildMember.server";
import { getDBGuildMemberInvites } from "~/models/dbGuildMember.server";
import { InviteTable } from "~/modules/guild/user/UserInviteTable";
import { XIcon } from "@heroicons/react/solid";
import { useManageMember } from "~/modules/guild/user/use-member";
import { useData } from "~/shared-hooks/use-data";
import type { LoaderData } from "../$member";
import { useGenericDiscordUser } from "~/shared-hooks/use-generic-discord-user";
import { useTypeSafeTranslation } from "~/shared-hooks/use-type-safe-translation";
import { error } from "~/lib/error";

export const meta: MetaFunction = () => ({
  title: "User Invite History | Netor",
});

type RouteLoaderData = {
  dbGuildMemberInvites: DBGuildMemberInvites;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const uri = session.get("uuid");

  error(params.guild, `params.guild is required`, 400);
  error(uri, `session is required`, 400);
  error(params.member, `params.member is required`, 400);

  const [dbGuildMemberInvites] = await Promise.all([
    getDBGuildMemberInvites(params.guild, params.member, uri),
  ]);

  return json<RouteLoaderData>({
    dbGuildMemberInvites,
  });
};

export default function Index() {
  let { apiUser, apiGuildMember, dbGuildMemberInvites, apiGuild } =
    useData() as LoaderData<RouteLoaderData>;
  apiUser = useGenericDiscordUser(apiUser ?? apiGuildMember)!;
  const { t } = useTypeSafeTranslation();

  const { removeInvite } = useManageMember(apiGuild, apiUser);

  const invitesSorted = dbGuildMemberInvites.sort(
    (a, b) =>
      new Date(b.date_created).valueOf() - new Date(a.date_created).valueOf()
  );

  return (
    <>
      <InviteTable
        actions={({ invite }) => (
          <Tooltip
            transition="pop"
            transitionDuration={300}
            transitionTimingFunction="ease"
            label={t("pages.inviteHistory.actionRemove")}
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
        )}
        invites={invitesSorted}
        user={apiUser}
        member={apiGuildMember}
      />
    </>
  );
}
