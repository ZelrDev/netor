import { createCookieSessionStorage } from "@remix-run/node";

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage({
    cookie: {
      name: "__session",
      path: "/",
      secure: true,
      secrets: [process.env.SESSION_SECRET || ""],
    },
  });

export { getSession, commitSession, destroySession };
