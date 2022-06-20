import type DiscordEmbed from "types/DiscordEmbed";
import { prisma } from "~/db.server";
import crypto from "crypto";
import type { embed, embed_field } from "@prisma/client";
import i18n from "~/i18next.server";
import { error } from "~/lib/error";

export type { guild as DBGuild } from "@prisma/client";
export type DBGuildEmbeds = DBGuildEmbed[];
export type DBGuildEmbedField = embed_field;
export interface DBGuildEmbed extends embed {
  fields?: DBGuildEmbedField[];
}

export async function deleteSessionURI(
  id: string,
  uri: string,
  rawErrorOutput?: boolean
) {
  const t = await i18n.getFixedT("en");

  try {
    return prisma.session_uri.deleteMany({
      where: {
        guild_id: id,
        token: uri,
      },
    });
  } catch (e) {
    error(false, t("errors.deleteURIFail"), 500, rawErrorOutput);
  }
}

export async function deleteURI(
  id: string,
  uri: string,
  rawErrorOutput?: boolean
) {
  const t = await i18n.getFixedT("en");

  try {
    return prisma.uri.deleteMany({
      where: {
        guild_id: id,
        token: uri,
      },
    });
  } catch (e) {
    error(false, t("errors.deleteURIFail"), 500, rawErrorOutput);
  }
}

export async function deleteDBEmbed(embedId: number, rawErrorOutput?: boolean) {
  const t = await i18n.getFixedT("en");

  try {
    return prisma.embed.delete({
      where: {
        id: embedId,
      },
    });
  } catch (e) {
    error(false, t("errors.deleteEmbedFail"), 500, rawErrorOutput);
  }
}

export async function createDBEmbed(
  guildId: string,
  embed: DiscordEmbed,
  rawErrorOutput?: boolean
) {
  const t = await i18n.getFixedT("en");

  let creation: DBGuildEmbed = await prisma.embed.create({
    data: {
      guild_id: guildId,
      title: embed.title,
      url: embed.url,
      description: embed.description,
      color: embed.color,
      footer_text: embed.footer?.text,
      footer_icon_url: embed.footer?.icon_url,
      image_url: embed.image?.url,
      thumbnail_url: embed.thumbnail.url,
      author_name: embed.author?.name,
      author_url: embed.author?.url,
      author_icon_url: embed.author?.icon_url,
      fields: embed.fields
        ? {
            createMany: {
              data: embed.fields.map((field) => ({
                name: field.name,
                value: field.value,
                inline: field.inline,
              })),
            },
          }
        : undefined,
    },
  });
  error(creation, t("errors.createEmbedDBFail"), 500, rawErrorOutput);
  try {
    const fields = await prisma.embed_field.findMany({
      where: {
        embed_id: creation.id,
      },
    });

    creation.fields = fields;

    return creation;
  } catch (e) {
    error(false, t("errors.createEmbedQueryFail"), 500, rawErrorOutput);
  }
}

export async function createSessionURI(
  id: string,
  uri: string,
  rawErrorOutput?: boolean
) {
  const t = await i18n.getFixedT("en");

  const uriDB = await prisma.uri.findFirst({
    where: {
      guild_id: id,
      token: uri,
    },
  });

  error(uriDB, t("errors.createSessionURIQueryFail"), 500, rawErrorOutput);
  const uuid = crypto.randomUUID();
  const update = await prisma.session_uri.create({
    data: {
      token: uuid,
      guild_id: uriDB.guild_id,
      user_id: uriDB.user_id,
    },
  });
  error(update, t("errors.createSessionURIDBFail"), 500, rawErrorOutput);
  return uuid;
}

export async function getURI(
  id: string,
  uri: string,
  rawErrorOutput?: boolean
) {
  const t = await i18n.getFixedT("en");

  try {
    return prisma.uri.findFirst({
      where: {
        token: uri,
        guild_id: id,
      },
    });
  } catch (e) {
    error(false, t("errors.validateSessionURIFail"), 500, rawErrorOutput);
  }
}

export async function getSessionURI(
  id: string,
  uri: string,
  rawErrorOutput?: boolean
) {
  const t = await i18n.getFixedT("en");

  try {
    return prisma.session_uri.findFirst({
      where: {
        token: uri,
        guild_id: id,
      },
    });
  } catch (e) {
    error(false, t("errors.validateSessionURIFail"), 500, rawErrorOutput);
  }
}

export async function validateSessionURI(
  id: string,
  uri: string,
  rawErrorOutput?: boolean
) {
  const t = await i18n.getFixedT("en");

  try {
    return (await prisma.session_uri.findFirst({
      where: {
        token: uri,
        guild_id: id,
      },
    }))
      ? true
      : false;
  } catch (e) {
    error(false, t("errors.validateSessionURIFail"), 500, rawErrorOutput);
  }
}

export async function getDBGuildEmbeds(
  id: string,
  uri: string,
  rawErrorOutput?: boolean
) {
  const t = await i18n.getFixedT("en");

  const session = await validateSessionURI(id, uri, rawErrorOutput);
  error(session, t("errors.validateDBGuildFail"), 401, rawErrorOutput);
  try {
    let embeds: DBGuildEmbeds = await prisma.embed.findMany({
      where: {
        guild_id: id,
      },
    });

    embeds.forEach(async (embed, idx) => {
      const fields = await prisma.embed_field.findMany({
        where: {
          embed_id: embed.id,
        },
      });
      embeds[idx].fields = fields;
    });

    return embeds;
  } catch (e) {
    error(false, t("errors.getGuildEmbedsFail"), 500, rawErrorOutput);
  }
}
export async function getDBGuild(
  id: string,
  uri: string,
  rawErrorOutput?: boolean
) {
  const t = await i18n.getFixedT("en");

  const session = await validateSessionURI(id, uri, rawErrorOutput);
  error(session, t("errors.validateDBGuildFail"), 401, rawErrorOutput);
  try {
    const guild = await prisma.guild.findFirst({
      where: {
        id,
      },
    });
    error(guild, "errors.noGuildDB", 500, rawErrorOutput);
    return guild;
  } catch (e) {
    error(false, "errors.failGuildDB", 500, rawErrorOutput);
  }
}

export async function toggleRR(
  id: string,
  enable: boolean,
  rawErrorOutput?: boolean
) {
  const t = await i18n.getFixedT("en");

  try {
    return prisma.guild.update({
      where: {
        id,
      },
      data: {
        rr_enabled: enable,
      },
    });
  } catch (e) {
    error(false, t("errors.toggleDBRRFail"), 500, rawErrorOutput);
  }
}

export async function toggleUM(
  id: string,
  enable: boolean,
  rawErrorOutput?: boolean
) {
  const t = await i18n.getFixedT("en");

  try {
    return prisma.guild.update({
      where: {
        id,
      },
      data: {
        um_enabled: enable,
      },
    });
  } catch (e) {
    error(false, t("errors.toggleDBUMFail"), 500, rawErrorOutput);
  }
}

export async function toggleRTM(
  id: string,
  enable: boolean,
  rawErrorOutput?: boolean
) {
  const t = await i18n.getFixedT("en");

  try {
    return prisma.guild.update({
      where: {
        id,
      },
      data: {
        rtm_enabled: enable,
      },
    });
  } catch (e) {
    error(false, t("errors.toggleDBRTMFail"), 500, rawErrorOutput);
  }
}

export async function updateRTMChannel(
  id: string,
  channelId: string,
  rawErrorOutput?: boolean
) {
  const t = await i18n.getFixedT("en");

  try {
    return prisma.guild.update({
      where: {
        id,
      },
      data: {
        rtm_channel_id: channelId,
      },
    });
  } catch (e) {
    error(false, t("errors.updateDBRTMChannelFail"), 500, rawErrorOutput);
  }
}

export async function updateUMLeaveChannel(
  id: string,
  channelId: string,
  rawErrorOutput?: boolean
) {
  const t = await i18n.getFixedT("en");

  try {
    return prisma.guild.update({
      where: {
        id,
      },
      data: {
        um_leave_channel_id: channelId,
      },
    });
  } catch (e) {
    error(false, t("errors.updateDBUMChannelFail"), 500, rawErrorOutput);
  }
}

export async function updateUMLeaveMessage(
  id: string,
  message: string,
  rawErrorOutput?: boolean
) {
  const t = await i18n.getFixedT("en");

  try {
    return prisma.guild.update({
      where: {
        id,
      },
      data: {
        um_leave_msg: message,
      },
    });
  } catch (e) {
    error(false, t("errors.updateDBUMChannelFail"), 500, rawErrorOutput);
  }
}

export async function updateUMLeaveMessageRAW(
  id: string,
  message: string,
  rawErrorOutput?: boolean
) {
  const t = await i18n.getFixedT("en");

  try {
    return prisma.guild.update({
      where: {
        id,
      },
      data: {
        um_leave_raw_msg: message,
      },
    });
  } catch (e) {
    error(false, t("errors.updateDBUMMSGFail"), 500, rawErrorOutput);
  }
}

export async function updateUMWelcomeMessageRAW(
  id: string,
  message: string,
  rawErrorOutput?: boolean
) {
  const t = await i18n.getFixedT("en");

  try {
    return prisma.guild.update({
      where: {
        id,
      },
      data: {
        um_welcome_raw_msg: message,
      },
    });
  } catch (e) {
    error(false, t("errors.updateDBUMMSGFail"), 500, rawErrorOutput);
  }
}

export async function updateUMWelcomeMessage(
  id: string,
  message: string,
  rawErrorOutput?: boolean
) {
  const t = await i18n.getFixedT("en");

  try {
    return prisma.guild.update({
      where: {
        id,
      },
      data: {
        um_welcome_msg: message,
      },
    });
  } catch (e) {
    error(false, t("errors.updateDBUMMSGFail"), 500, rawErrorOutput);
  }
}

export async function updateUMWelcomeChannel(
  id: string,
  channelId: string,
  rawErrorOutput?: boolean
) {
  const t = await i18n.getFixedT("en");

  try {
    return prisma.guild.update({
      where: {
        id,
      },
      data: {
        um_welcome_channel_id: channelId,
      },
    });
  } catch (e) {
    error(false, t("errors.updateDBUMChannelFail"), 500, rawErrorOutput);
  }
}
