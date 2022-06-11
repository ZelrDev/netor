import { Outlet } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { getAPIGuild } from "~/api-requests/apiGuild.server";
import type { APIGuild } from "~/api-requests/apiGuild.server";
import type { DBGuild } from "~/models/dbGuild.server";
import { getDBGuild } from "~/models/dbGuild.server";
import { getSession } from "~/modules/auth/sessions.server";
import { GlobalAppNavbar } from "~/ui/GlobalAppNavbar";
import { useData } from "~/shared-hooks/use-data";
import i18n from "~/i18next.server";
import { error } from "~/lib/error";

export type LoaderData<T = {}> = T & {
  apiGuild: APIGuild;
  dbGuild: DBGuild;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  let t = await i18n.getFixedT(request);

  // authentication
  if (params?.uri) return null;
  const session = await getSession(request.headers.get("Cookie"));
  const uri = session.get("uuid");

  error(params.guild, `params.guild is required`, 400);
  error(uri, `session is required`, 400);

  const [dbGuild, apiGuild] = await Promise.all([
    getDBGuild(params.guild, uri),
    getAPIGuild(params.guild, uri),
  ]);
  error(apiGuild.completed, t("errors.getAPIGuildFail"), 400);

  return json<LoaderData>({
    apiGuild: apiGuild.result!,
    dbGuild,
  });
};

export default function Guild() {
  const data = useData();
  return data === null ? (
    <Outlet />
  ) : (
    <GlobalAppNavbar apiGuild={data.apiGuild}>
      <Outlet context={data} />
    </GlobalAppNavbar>
  );
}
