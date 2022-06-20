import type { ActionFunction } from "@remix-run/node";
import type DiscordEmbed from "types/DiscordEmbed";
import { sendMessageEmbed } from "~/api-requests/apiGuildMessages.server";
import { validateSessionURI } from "~/models/dbGuild.server";
import { getSession } from "~/modules/auth/sessions.server";
import i18n from "~/i18next.server";
import { error } from "~/lib/error";

export const action: ActionFunction = async ({ request, params }) => {
  let t = await i18n.getFixedT(request);

  const session = await getSession(request.headers.get("Cookie"));
  const uri = session.get("uuid");

  error(params.guild, `params.guild is required`, 400, true);
  error(uri, `session is required`, 400, true);

  const data = await request.formData();

  const validate = await validateSessionURI(params.guild, uri, true);
  error(validate, t("errors.validateDBGuildFail"), 400, true);

  error(data.get("embed"), `embed is required`, 400, true);
  const embed: DiscordEmbed = JSON.parse(data.get("embed")!.toString());

  const channelId = data.get("channel_id");
  error(channelId, `channel_id is required`, 400, true);

  const result = await sendMessageEmbed(
    params.guild,
    uri,
    channelId.toString(),
    embed
  );
  error(result.result, result.message, 500, true);
  return null;
};
