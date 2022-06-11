import type { LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { error } from "~/lib/error";
import { safeRedirect } from "~/lib/safeRedirect";
import { deleteSessionURI } from "~/models/dbGuild.server";
import { getSession, destroySession } from "~/modules/auth/sessions.server";

export const loader: LoaderFunction = async ({ request, params }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const session_uri = session.get("uuid");

  error(session_uri, "session is required");
  error(params.guild, "params.guild is required");

  await deleteSessionURI(params.guild, session_uri);

  return redirect(safeRedirect("/"), {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
};

export default function Index() {
  return <></>;
}
