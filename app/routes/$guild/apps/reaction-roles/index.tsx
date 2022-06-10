import type { ActionFunction } from "@remix-run/node";
import { Link, useOutletContext, useParams, useSubmit } from "@remix-run/react";
import { getDBGuild, toggleRR } from "~/models/dbGuild.server";
import { useEffect, useState } from "react";
import { getSession } from "~/modules/auth/sessions.server";
import { Button, Stack, Switch, Title } from "@mantine/core";
import { Breadcrumbs } from "~/ui/Breadcrumbs";
import { error } from "~/utils";
import type { LoaderData } from "~/routes/$guild/apps";
import { useData } from "~/shared-hooks/use-data";
import { useTypeSafeTranslation } from "~/shared-hooks/use-type-safe-translation";

export const action: ActionFunction = async ({ request, params }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const uri = session.get("uuid");

  error(params.guild, `params.guild is required`, 400, true);
  error(uri, `session is required`, 400, true);

  const data = await request.formData();

  const [dbGuild] = await Promise.all([getDBGuild(params.guild, uri, true)]);

  if (data.get("enabled") === "true" && !dbGuild.rr_enabled)
    toggleRR(params.guild, true, true);
  if (data.get("enabled") === "false" && dbGuild.rr_enabled)
    toggleRR(params.guild, false, true);

  return "OK";
};

export default function Index() {
  const { dbGuild } = useData() as LoaderData;
  const [checked, setChecked] = useState<boolean>(false);
  const [ready, setReady] = useState<boolean>(false);
  const params = useParams();
  const { t } = useTypeSafeTranslation();
  const navigateURL = (path: string) => `/${params.guild}/${path}`;
  const submit = useSubmit();

  useEffect(() => {
    if (dbGuild.rr_enabled) setChecked(true);
    // wait for checked to be fully set to true so it doesnt trigger a post request
    setTimeout(() => setReady(true), 250);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (ready) {
      let formData = new FormData();
      formData.append("enabled", checked!.toString());
      submit(formData, { method: "post" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checked]);

  return (
    <>
      <Title order={2}>{t("modules.reactionRoles.name")}</Title>
      <Stack spacing="md" pt="md">
        <Switch
          checked={checked}
          onChange={(event) => setChecked(event.currentTarget.checked)}
          label={t("common.enabled")}
        />
        <Link to="create">
          <Button>{t("modules.embedGenerator.createTemplate")}</Button>
        </Link>
      </Stack>
    </>
  );
}
