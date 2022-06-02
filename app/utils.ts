import { json } from "@remix-run/node";
import { useMatches } from "@remix-run/react";
import { useMemo } from "react";
import DiscordEmbed from "types/DiscordEmbed";
import { DBGuildEmbed, DBGuildEmbedField } from "./models/dbGuild.server";
import he from "he";

const DEFAULT_REDIRECT = "/";

export const cleanUpMessage = (message: string, tags: any) => {
  tags.forEach((item: { value: any }, idx: any) => {
    message = message
      .replaceAll(`<span class="mention" data-index="${idx}" `, "")
      .replaceAll(
        `data-value="${item.value}">﻿<span contenteditable="false"><span class="ql-mention-denotation-char">^`,
        ""
      );

    // var
    message = message.replaceAll(
      `</span>${item.value}</span>﻿</span>`,
      `^${item.value}`
    );
  });
  message = message
    .replaceAll(`data-denotation-char="^" `, "")
    .replaceAll(`data-id="" `, "")
    .replaceAll("<p>", "")
    .replaceAll("</p>", "");
  return he.decode(message);
};

/**
 * This should be used any time the redirect path is user-provided
 * (Like the query string on our login/signup pages). This avoids
 * open-redirect vulnerabilities.
 * @param {string} to The redirect destination
 * @param {string} defaultRedirect The redirect to use if the to is unsafe.
 */
export function safeRedirect(
  to: FormDataEntryValue | string | null | undefined,
  defaultRedirect: string = DEFAULT_REDIRECT
) {
  if (!to || typeof to !== "string") {
    return defaultRedirect;
  }

  if (!to.startsWith("/") || to.startsWith("//")) {
    return defaultRedirect;
  }

  return to;
}

/**
 * This base hook is used in other hooks to quickly search for specific data
 * across all loader data using useMatches.
 * @param {string} id The route id
 * @returns {JSON|undefined} The router data or undefined if not found
 */
export function useMatchesData(
  id: string
): Record<string, unknown> | undefined {
  const matchingRoutes = useMatches();
  const route = useMemo(
    () => matchingRoutes.find((route) => route.id === id),
    [matchingRoutes, id]
  );
  return route?.data;
}

type RecursivelyReplaceNullWithUndefined<T> = T extends null
  ? undefined // Note: Add interfaces here of all GraphQL scalars that will be transformed into an object
  : T extends Date
  ? T
  : {
      [K in keyof T]: T[K] extends (infer U)[]
        ? RecursivelyReplaceNullWithUndefined<U>[]
        : RecursivelyReplaceNullWithUndefined<T[K]>;
    };

/**
 * Recursively replaces all nulls with undefineds.
 * Skips object classes (that have a `.__proto__.constructor`).
 *
 * Unfortunately, until https://github.com/apollographql/apollo-client/issues/2412
 * gets solved at some point,
 * this is the only workaround to prevent `null`s going into the codebase,
 * if it's connected to a Apollo server/client.
 */
export function replaceNullsWithUndefineds<T>(
  obj: T
): RecursivelyReplaceNullWithUndefined<T> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const newObj: any = {};
  Object.keys(obj).forEach((k) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const v: any = (obj as any)[k];
    newObj[k as keyof T] =
      v === null
        ? undefined
        : // eslint-disable-next-line no-proto
        v && typeof v === "object" && v.__proto__.constructor === Object
        ? replaceNullsWithUndefineds(v)
        : v;
  });
  return newObj;
}

export function error(
  condition: any,
  message: any,
  code?: number,
  raw?: boolean
): asserts condition {
  if (!condition) {
    let title = "Unknown Error";
    if (code === 401) title = "Unauthorized Session";
    if (code === 400) title = "Missing parameters";
    if (code === 500) title = "Internal Server Error";
    throw json(
      {
        message,
        title,
        raw_error: raw,
      },
      code
    );
  }
}

export function discordServerAvatar(
  id?: string | undefined | null,
  hash?: string | undefined | null
) {
  return hash ? `https://cdn.discordapp.com/icons/${id}/${hash}.png` : "";
}
export function discordAvatar(
  id?: string | undefined | null,
  hash?: string | undefined | null
) {
  return hash ? `https://cdn.discordapp.com/avatars/${id}/${hash}.png` : "";
}

export function convertDBEmbedToDiscordEmbed(dbEmbed_: DBGuildEmbed) {
  const dbEmbed = replaceNullsWithUndefineds(dbEmbed_);

  const discordEmbed: DiscordEmbed = {
    title: dbEmbed.title,
    url: dbEmbed.url,
    description: dbEmbed.description,
    color: dbEmbed.color,
    footer: dbEmbed.footer_text
      ? {
          text: dbEmbed.footer_text,
          icon_url: dbEmbed.footer_icon_url,
        }
      : undefined,
    image: dbEmbed.image_url
      ? {
          url: dbEmbed.image_url,
        }
      : undefined,
    thumbnail: {
      url: dbEmbed.thumbnail_url,
    },
    author: dbEmbed.author_name
      ? {
          name: dbEmbed.author_name,
          url: dbEmbed.author_url,
          icon_url: dbEmbed.author_icon_url,
        }
      : undefined,
    fields: dbEmbed.fields
      ? dbEmbed.fields.map((field) => ({
          name: field.name,
          value: field.value,
          inline: field.inline ? true : false,
        }))
      : undefined,
  };

  return discordEmbed;
}
