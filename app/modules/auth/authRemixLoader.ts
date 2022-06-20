import type { LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/server-runtime";
import {
  createSessionURI,
  deleteURI,
  getSessionURI,
  getURI,
} from "~/models/dbGuild.server";
import { getAPIUser } from "~/api-requests/apiUser.server";
import { getSession, commitSession } from "~/modules/auth/sessions.server";
import type { LoaderData } from "./loaderData";
import i18n from "~/i18next.server";
import { error } from "~/lib/error";
import { safeRedirect } from "~/lib/safeRedirect";

export const loader: LoaderFunction = async ({ request, params }) => {
  let t = await i18n.getFixedT(request);

  const session = await getSession(request.headers.get("Cookie"));
  const session_uri = session.get("uuid");
  const url = new URL(request.url);
  const callback_uri = url.searchParams.get("url");

  error(params.guild, `params.guild is required`, 400);
  error(params.uri, `params.uri is required`, 400);

  if (session_uri) {
    const loggedIn = await getSessionURI(params.guild, session_uri);
    if (loggedIn) {
      const uri = await getURI(params.guild, params.uri);
      if (uri?.user_id) {
        if (loggedIn.user_id !== uri?.user_id) {
          const [beforeUser, afterUser] = await Promise.all([
            getAPIUser(params.guild, loggedIn?.user_id, loggedIn.token),
            getAPIUser(params.guild, uri?.user_id, loggedIn.token),
          ]);

          error(beforeUser.completed, t("errors.getAPIUserFail"), 500);
          error(afterUser.completed, t("errors.getAPIUserFail"), 500);

          return json<LoaderData>({
            beforeUser: beforeUser.result!,
            afterUser: afterUser.result!,
          });
        }
      }
    }
  }

  const uuid = await createSessionURI(params.guild, params.uri);
  await deleteURI(params.guild, params.uri);
  session.set("uuid", uuid);

  return redirect(safeRedirect(callback_uri || `/${params.guild}/apps`), {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
};
