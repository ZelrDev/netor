import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { getSession } from "~/modules/auth/sessions.server";
import { PunishmentButtons } from "~/modules/guild/user/UserPunishmentButtons";
import { Button, SimpleGrid, Text } from "@mantine/core";
import { CurrentTimeout } from "~/modules/guild/user/UserCurrentTimeout";
import type { DBGuildMemberPunishmentsRAW } from "~/models/dbGuildMember.server";
import { getDBGuildMemberPunishmentsRAW } from "~/models/dbGuildMember.server";
import { XIcon } from "@heroicons/react/solid";
import type { LoaderData } from "../$member";
import { useManageMember } from "~/modules/guild/user/use-member";
import { useTypeSafeTranslation } from "~/shared-hooks/use-type-safe-translation";
import { error } from "~/lib/error";
import { customMeta } from "~/meta";
import { useData } from "~/shared-hooks/use-data";
export const meta: MetaFunction = customMeta({
  title: "User Overview | Netor",
});

type RouteLoaderData = {
  dbGuildMemberPunishmentsRAW: DBGuildMemberPunishmentsRAW;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const uri = session.get("uuid");

  error(params.guild, `params.guild is required`, 400);
  error(uri, `session is required`, 400);
  error(params.member, `params.member is required`, 400);

  const [dbGuildMemberPunishmentsRAW] = await Promise.all([
    getDBGuildMemberPunishmentsRAW(params.guild, params.member, true),
  ]);

  return json<RouteLoaderData>({
    dbGuildMemberPunishmentsRAW,
  });
};

export default function Index() {
  const { apiGuildMember, apiGuild, apiUser, dbGuildMemberPunishmentsRAW } =
    useData() as LoaderData<RouteLoaderData>;

  const { t } = useTypeSafeTranslation();

  const { removeMemberTimeout } = useManageMember(
    apiGuild,
    (apiGuildMember ?? apiUser)!
  );

  return (
    <>
      {apiGuildMember ? (
        <SimpleGrid
          breakpoints={[
            { maxWidth: "md", cols: 3, spacing: "sm" },
            { maxWidth: "sm", cols: 2, spacing: "sm" },
            { maxWidth: "xs", cols: 1, spacing: "sm" },
          ]}
          cols={4}
          pt="md"
        >
          <CurrentTimeout apiGuildMember={apiGuildMember}>
            <Button
              leftIcon={<XIcon width={20} />}
              color="orange"
              variant="light"
              onClick={removeMemberTimeout}
            >
              {t("common.remove")}
            </Button>
          </CurrentTimeout>
          <PunishmentButtons
            dbGuildMemberPunishmentsRAW={dbGuildMemberPunishmentsRAW}
            apiGuild={apiGuild}
            apiGuildMember={apiGuildMember}
          />
        </SimpleGrid>
      ) : (
        <Text size="lg">{t("errors.bannedUser")}</Text>
      )}
    </>
  );
}
