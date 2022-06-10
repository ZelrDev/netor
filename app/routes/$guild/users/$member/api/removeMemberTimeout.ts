import type { ActionFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { validateSessionURI } from "~/models/dbGuild.server";
import { getSession } from "~/modules/auth/sessions.server";
import { error } from "~/utils";
import errors from "~/errors.json";
import {
  banAPIGuildMember,
  kickAPIGuildMember,
  timeoutAPIGuildMember,
  removeTimeoutAPIGuildMember,
} from "~/api-requests/apiGuildMember.server";
import i18n from "~/i18next.server";

export const action: ActionFunction = async ({ request, params }) => {
  let t = await i18n.getFixedT(request);

  const session = await getSession(request.headers.get("Cookie"));
  const uri = session.get("uuid");

  error(params.guild, `params.guild is required`, 400, true);
  error(uri, `session is required`, 400, true);

  const data = await request.formData();

  const validate = await validateSessionURI(params.guild, uri, true);
  error(validate, t("errors.validateDBGuildFail"), 401, true);
  const id = data.get("user_id")?.toString();
  error(id, "user_id is required", 400, true);

  const result = await removeTimeoutAPIGuildMember(params.guild, uri, id);
  error(result.result, result.message, 500, true);
  return null;
};
