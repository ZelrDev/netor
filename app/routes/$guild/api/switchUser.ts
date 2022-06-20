import { redirect } from "@remix-run/node";
import type { ActionFunction } from "@remix-run/server-runtime";
import { error } from "~/lib/error";
import { safeRedirect } from "~/lib/safeRedirect";
import {
  deleteSessionURI,
  createSessionURI,
  deleteURI,
} from "~/models/dbGuild.server";
import { getSession, commitSession } from "~/modules/auth/sessions.server";

export const action: ActionFunction = async ({ request, params }) => {
  const data = await request.formData();
  const session = await getSession(request.headers.get("Cookie"));
  const uri = session.get("uuid");
  const switchUser = data.get("switch");
  const url = new URL(request.url);
  const callback_uri = url.searchParams.get("url");

  error(params.guild, `params.guild is required`, 400, true);
  error(params.uri, `params.uri is required`, 400, true);
  error(uri, `session is required`, 400, true);
  error(switchUser, `switch is required`, 400, true);

  if (switchUser === "yes") {
    await deleteSessionURI(params.guild, uri);
    const uuid = await createSessionURI(params.guild, params.uri);
    await deleteURI(params.guild, params.uri);
    session.set("uuid", uuid);
    return redirect(safeRedirect(callback_uri || `/${params.guild}/apps`), {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  } else {
    await deleteURI(params.guild, params.uri);
    return redirect(safeRedirect(callback_uri || `/${params.guild}/apps`));
  }
};
