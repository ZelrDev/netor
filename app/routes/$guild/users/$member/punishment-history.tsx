import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { getSession } from "~/modules/auth/sessions.server";
import { getAPIGuildMemberBan } from "~/api-requests/apiGuildMember.server";
import type { APIGuildMemberBan } from "~/api-requests/apiGuildMember.server";
import type { DBGuildMemberPunishments } from "~/models/dbGuildMember.server";
import { getDBGuildMemberPunishments } from "~/models/dbGuildMember.server";
import { UserPunishmentTable } from "~/modules/guild/user/UserPunishmentTable";
import { useEffect, useState } from "react";
import type { LoaderData } from "../$member";
import { useData } from "~/shared-hooks/use-data";
import { useGenericDiscordUser } from "~/shared-hooks/use-generic-discord-user";
import i18n from "~/i18next.server";
import { error } from "~/lib/error";
import { customMeta } from "~/meta";
export const meta: MetaFunction = customMeta({
  title: "User Punishment History | Netor",
});

type RouteLoaderData = {
  apiGuildMemberBan: APIGuildMemberBan;
  dbGuildMemberPunishments: DBGuildMemberPunishments;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  let t = await i18n.getFixedT(request);

  const session = await getSession(request.headers.get("Cookie"));
  const uri = session.get("uuid");

  error(params.guild, `params.guild is required`, 400);
  error(uri, `session is required`, 400);
  error(params.member, `params.member is required`, 400);

  const [dbGuildMemberPunishments, apiGuildMemberBan] = await Promise.all([
    getDBGuildMemberPunishments(params.guild, params.member, uri, true),
    getAPIGuildMemberBan(params.guild, uri, params.member),
  ]);

  error(apiGuildMemberBan.completed === true, t("errors.getDBPunishmentsFail"));

  return json<RouteLoaderData>({
    apiGuildMemberBan: apiGuildMemberBan.result!,
    dbGuildMemberPunishments,
  });
};

export default function Index() {
  let {
    apiUser,
    apiGuild,
    dbGuildMemberPunishments,
    apiGuildMember,
    apiGuildMemberBan,
  } = useData() as LoaderData<RouteLoaderData>;

  const [banned, setBanned] = useState<boolean>(false);
  apiUser = useGenericDiscordUser(apiUser ?? apiGuildMember)!;

  useEffect(() => {
    setBanned(apiGuildMemberBan != null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const punishmentsSorted = dbGuildMemberPunishments.sort(
    (a, b) => new Date(b.date).valueOf() - new Date(a.date).valueOf()
  );

  return (
    <>
      <UserPunishmentTable
        banned={banned}
        apiUser={apiUser}
        apiGuild={apiGuild}
        apiGuildMember={apiGuildMember}
        dbGuildMemberPunishments={punishmentsSorted}
      />
    </>
  );
}
