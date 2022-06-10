import type { ActionFunction } from "@remix-run/node";
import { redirect } from "@remix-run/server-runtime";
import { getDBGuild, toggleRTM, toggleUM } from "~/models/dbGuild.server";
import { getSession } from "~/modules/auth/sessions.server";
import { error } from "~/utils";

export const action: ActionFunction = async ({ request, params }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const uri = session.get("uuid");

  error(params.guild, `params.guild is required`, 400, true);
  error(uri, `session is required`, 400, true);

  const dbGuild = await getDBGuild(params.guild, uri, true);

  if (!dbGuild.um_enabled) toggleUM(params.guild, true, true);
  if (dbGuild.um_enabled) toggleUM(params.guild, false, true);

  return null;
};
