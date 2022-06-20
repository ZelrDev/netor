import type { MetaFunction } from "@remix-run/node";
import appIcon from "~/media/branding/App.png";

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Netor - A bot that fully integrates with Discord",
  viewport: "width=device-width,initial-scale=1",
  name: "Netor - A bot that fully integrates with Discord",
  description:
    "Moderate with ease. No need for extra commands, right click on the user and ban. Automatically logs all punishments.",
  "og:type": "website",
  "og:url": "https://netor.zelr.me",
  "og:title": "Netor - A bot that fully integrates with Discord",
  "og:description":
    "Moderate with ease. No need for extra commands, right click on the user and ban. Automatically logs all punishments.",
  "og:image": appIcon,
  "twitter:card": "summary_large_image",
  "twitter:url": "https://netor.zelr.me",
  "twitter:title": "Netor - A bot that fully integrates with Discord",
  "twitter:description":
    "Moderate with ease. No need for extra commands, right click on the user and ban. Automatically logs all punishments.",
  "twitter:image": appIcon,
});

export const customMeta = (metaData: {
  charset?: "utf-8";
  title?: string;
  viewport?: string;
  name?: string;
  description?: string;
  ogType?: string;
  ogTitle?: string;
  ogUrl?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterCard?: string;
  twitterUrl?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
}) => {
  const meta: MetaFunction = () => ({
    charset: metaData.charset ?? "utf-8",
    title: metaData.title ?? "Netor - A bot that fully integrates with Discord",
    viewport: metaData.viewport ?? "width=device-width,initial-scale=1",
    name: metaData.name ?? "Netor - A bot that fully integrates with Discord",
    description:
      metaData.description ??
      "Moderate with ease. No need for extra commands, right click on the user and ban. Automatically logs all punishments.",
    "og:type": metaData.ogType ?? "website",
    "og:url": metaData.ogUrl ?? "https://netor.zelr.me",
    "og:title":
      metaData.ogTitle ?? "Netor - A bot that fully integrates with Discord",
    "og:description":
      metaData.description ??
      "Moderate with ease. No need for extra commands, right click on the user and ban. Automatically logs all punishments.",
    "og:image": metaData.ogImage ?? appIcon,
    "twitter:card": metaData.twitterCard ?? "summary_large_image",
    "twitter:url": metaData.twitterUrl ?? "https://netor.zelr.me",
    "twitter:title":
      metaData.twitterTitle ??
      "Netor - A bot that fully integrates with Discord",
    "twitter:description":
      metaData.twitterDescription ??
      "Moderate with ease. No need for extra commands, right click on the user and ban. Automatically logs all punishments.",
    "twitter:image": metaData.twitterImage ?? appIcon,
  });

  return meta;
};
