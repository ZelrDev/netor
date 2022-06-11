import type DiscordEmbed from "types/DiscordEmbed";
import type { DBGuildEmbed } from "~/models/dbGuild.server";
import { replaceNullsWithUndefineds } from "./recursivelyReplaceNullsWithUndefineds";

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
