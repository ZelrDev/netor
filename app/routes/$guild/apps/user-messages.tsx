import { useLoaderData, useOutletContext, useParams } from "@remix-run/react";
import { useEffect, useState } from "react";
import { Stack, Switch, Title } from "@mantine/core";
import { Breadcrumbs } from "~/ui/Breadcrumbs";
import { UM } from "~/modules/guild/user-messages/UserMessageInput";
import { useGuild } from "~/modules/guild/use-guild";
import type { LoaderData } from "~/routes/$guild/apps";
import { useData } from "~/shared-hooks/use-data";
import { useTypeSafeTranslation } from "~/shared-hooks/use-type-safe-translation";

export default function Index() {
  const { dbGuild, apiGuildChannels } = useData() as LoaderData;
  const [checked, setChecked] = useState<boolean>(false);
  const [ready, setReady] = useState<boolean>(false);
  const params = useParams();
  const navigateURL = (path: string) => `/${params.guild}/${path}`;
  const { toggleUM } = useGuild(dbGuild);
  const { t } = useTypeSafeTranslation();

  useEffect(() => {
    if (dbGuild.um_enabled) setChecked(true);
    // wait for checked to be fully set to true so it doesnt trigger a post request
    setTimeout(() => setReady(true), 250);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    ready && dbGuild.um_enabled !== checked && toggleUM();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checked]);

  return (
    <>
      <Title order={2}>{t("modules.userMessages.name")}</Title>
      <Stack spacing="md" pt="md">
        <Switch
          checked={checked}
          onChange={(event) => setChecked(event.currentTarget.checked)}
          label={t("common.enabled")}
        />
        <Stack spacing="xl">
          <UM
            apiGuildChannels={apiGuildChannels}
            dbGuild={dbGuild}
            type="WELCOME"
          />
          <UM
            apiGuildChannels={apiGuildChannels}
            dbGuild={dbGuild}
            type="LEAVE"
          />
        </Stack>
      </Stack>
    </>
  );
}
