import { createCookie } from "@remix-run/node"; // or "@remix-run/cloudflare"

export const userPrefs = createCookie("userPrefs", {
  maxAge: 60 * 60 * 24 * 365 * 10,
});
