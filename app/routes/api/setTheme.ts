import type { ActionFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { userPrefs } from "~/cookies";

export const action: ActionFunction = async ({ request, params }) => {
  let cookie = await userPrefs.parse(request.headers.get("Cookie"));

  const data = await request.formData();
  if (data.get("theme") === "dark") {
    if (!cookie) cookie = { theme: "dark" };
    cookie["theme"] = "dark";
  } else if (data.get("theme") === "system") {
    if (!cookie) cookie = { theme: "system" };
    cookie["theme"] = "system";
  } else {
    if (!cookie) cookie = { theme: "light" };
    cookie["theme"] = "light";
  }

  return redirect(data.get("pathname")?.toString() || "/", {
    headers: {
      "Set-Cookie": await userPrefs.serialize(cookie),
    },
  });
};
