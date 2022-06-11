import type { MetaFunction } from "@remix-run/server-runtime";
import { SwitchUser } from "~/modules/auth/SwitchUserPage";
export { loader } from "~/modules/auth/authRemixLoader";

export const meta: MetaFunction = () => ({
  title: "Switch User? | Netor",
  name: "This URL has been invalidated.",
  description:
    "Posting URLs in Discord will automatically invalidate them for your own security.",
  "og:type": "website",
  "og:url": "https://netor.zelr.me",
  "og:title": "This URL has been invalidated.",
  "og:description":
    "Posting URLs in Discord will automatically invalidate them for your own security.",
  "twitter:card": "summary_large_image",
  "twitter:url": "https://netor.zelr.me",
  "twitter:title": "This URL has been invalidated.",
  "twitter:description":
    "Posting URLs in Discord will automatically invalidate them for your own security.",
});

export default SwitchUser;
