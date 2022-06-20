import { customMeta } from "~/meta";
import type { MetaFunction } from "@remix-run/server-runtime";
import { SwitchUser } from "~/modules/auth/SwitchUserPage";
export { loader } from "~/modules/auth/authRemixLoader";
export const meta: MetaFunction = customMeta({
  title: "Switch User? | Netor",
  name: "This URL has been invalidated.",
  description:
    "Posting URLs in Discord will automatically invalidate them for your own security.",
  ogType: "website",
  ogUrl: "https://netor.zelr.me",
  ogTitle: "This URL has been invalidated.",
  ogDescription:
    "Posting URLs in Discord will automatically invalidate them for your own security.",
  twitterCard: "summary_large_image",
  twitterUrl: "https://netor.zelr.me",
  twitterTitle: "This URL has been invalidated.",
  twitterDescription:
    "Posting URLs in Discord will automatically invalidate them for your own security.",
});

export default SwitchUser;
