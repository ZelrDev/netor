import type DiscordEmbed from "types/DiscordEmbed";

export const convertDiscordEmbedToDBEmbed = (
  guildId: string | number,
  embed: DiscordEmbed
) => {
  return {
    id: 0,
    guild_id: guildId.toString(),
    title: embed.title ?? null,
    url: embed.url ?? null,
    description: embed.description ?? null,
    color: embed.color ?? null,
    footer_text: embed.footer?.text ?? null,
    footer_icon_url: embed.footer?.icon_url ?? null,
    image_url: embed.image?.url ?? null,
    thumbnail_url: embed.thumbnail.url ?? null,
    author_name: embed.author?.name ?? null,
    author_url: embed.author?.url ?? null,
    author_icon_url: embed.author?.icon_url ?? null,
    fields: embed.fields
      ? embed.fields.map((field, idx) => ({
          id: idx,
          embed_id: 0,
          name: field.name,
          value: field.value,
          inline: field.inline,
        }))
      : undefined,
  };
};
