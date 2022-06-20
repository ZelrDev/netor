import type { ActionFunction } from "@remix-run/node";
import { error } from "~/lib/error";
import { getDBGuild, updateRTMChannel } from "~/models/dbGuild.server";
import { getSession } from "~/modules/auth/sessions.server";

export const action: ActionFunction = async ({ request, params }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const uri = session.get("uuid");

  error(params.guild, `params.guild is required`, 400, true);
  error(uri, `session is required`, 400, true);

  const data = await request.formData();

  const dbGuild = await getDBGuild(params.guild, uri, true);

  if (data.get("channel") !== dbGuild.rtm_channel_id) {
    updateRTMChannel(params.guild, data.get("channel")?.toString() ?? "", true);
  }
  return null;
};
