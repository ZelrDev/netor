import type { ActionFunction } from "@remix-run/node";
import {
  getDBGuild,
  updateUMLeaveChannel,
  updateUMLeaveMessage,
  updateUMLeaveMessageRAW,
  updateUMWelcomeChannel,
  updateUMWelcomeMessage,
  updateUMWelcomeMessageRAW,
} from "~/models/dbGuild.server";
import { getSession } from "~/modules/auth/sessions.server";
import { cleanUpMessage, error } from "~/utils";
import { tags } from "~/modules/guild/user-messages/UserMessageInput";

export const action: ActionFunction = async ({ request, params }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const uri = session.get("uuid");

  error(params.guild, `params.guild is required`, 400, true);
  error(uri, `session is required`, 400, true);

  const data = await request.formData();

  const [dbGuild] = await Promise.all([getDBGuild(params.guild, uri, true)]);

  if (
    data.get("welcome_channel") &&
    data.get("welcome_channel") !== dbGuild.um_welcome_channel_id
  )
    updateUMWelcomeChannel(
      params.guild,
      data.get("welcome_channel")?.toString() ?? "",
      true
    );

  if (
    data.get("leave_channel") &&
    data.get("leave_channel") !== dbGuild.um_welcome_channel_id
  )
    updateUMLeaveChannel(
      params.guild,
      data.get("leave_channel")?.toString() ?? "",
      true
    );

  if (
    data.get("welcome_msg") &&
    data.get("welcome_msg") !== dbGuild.um_welcome_msg
  ) {
    updateUMWelcomeMessage(
      params.guild,
      cleanUpMessage(data.get("welcome_msg")?.toString() ?? "", tags),
      true
    );
    updateUMWelcomeMessageRAW(
      params.guild,
      data.get("welcome_msg")?.toString() ?? "",
      true
    );
  }

  if (
    data.get("leave_msg") &&
    data.get("leave_msg") !== dbGuild.um_welcome_channel_id
  ) {
    updateUMLeaveMessage(
      params.guild,
      cleanUpMessage(data.get("leave_msg")?.toString() ?? "", tags),
      true
    );
    updateUMLeaveMessageRAW(
      params.guild,
      data.get("leave_msg")?.toString() ?? "",
      true
    );
  }

  return "OK";
};
