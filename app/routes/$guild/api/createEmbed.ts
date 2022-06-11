import type { ActionFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import type DiscordEmbed from "types/DiscordEmbed";
import { validateSessionURI, createDBEmbed } from "~/models/dbGuild.server";
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

  const valid = await validateSessionURI(params.guild, uri, true);
  error(valid, t("errors.validateDBGuildFail"), 401, true);

  const embedId = data.get("embed");
  error(embedId, `embed is required`, 400, true);
  const embed: DiscordEmbed = JSON.parse(data.get("embed")!.toString());
  await createDBEmbed(params.guild, embed, true);

  return redirect(`/${params.guild}/apps/embed-generator`);
};
