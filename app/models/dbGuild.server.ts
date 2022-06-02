import DiscordEmbed from "types/DiscordEmbed";
import { prisma } from "~/db.server";
import crypto from "crypto";
import { embed, embed_field } from "@prisma/client";
import { error } from "~/utils";
import errors from "~/errors.json";

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
  try {
    return prisma.session_uri.deleteMany({
      where: {
        guild_id: id,
        token: uri,
      },
    });
  } catch (e) {
    error(false, errors.DELETE_URI_FAIL, 500, rawErrorOutput);
  }
}

export async function deleteURI(
  id: string,
  uri: string,
  rawErrorOutput?: boolean
) {
  try {
    return prisma.uri.deleteMany({
      where: {
        guild_id: id,
        token: uri,
      },
    });
  } catch (e) {
    error(false, errors.DELETE_URI_FAIL, 500, rawErrorOutput);
  }
}

export async function deleteDBEmbed(embedId: number, rawErrorOutput?: boolean) {
  try {
    return prisma.embed.delete({
      where: {
        id: embedId,
      },
    });
  } catch (e) {
    error(false, errors.DELETE_EMBED_FAIL, 500, rawErrorOutput);
  }
}

export async function createDBEmbed(
  guildId: string,
  embed: DiscordEmbed,
  rawErrorOutput?: boolean
) {
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
  error(creation, errors.CREATE_EMBED_DB_FAIL, 500, rawErrorOutput);
  try {
    const fields = await prisma.embed_field.findMany({
      where: {
        embed_id: creation.id,
      },
    });

    creation.fields = fields;

    return creation;
  } catch (e) {
    error(false, errors.CREATE_EMBED_QUERY_FAIL, 500, rawErrorOutput);
  }
}

export async function createSessionURI(
  id: string,
  uri: string,
  rawErrorOutput?: boolean
) {
  const uriDB = await prisma.uri.findFirst({
    where: {
      guild_id: id,
      token: uri,
    },
  });

  error(uriDB, errors.CREATE_SESSION_URI_QUERY_FAIL, 500, rawErrorOutput);
  const uuid = crypto.randomUUID();
  const update = await prisma.session_uri.create({
    data: {
      token: uuid,
      guild_id: uriDB.guild_id,
      user_id: uriDB.user_id,
    },
  });
  error(update, errors.CREATE_SESSION_URI_DB_FAIL, 500, rawErrorOutput);
  return uuid;
}

export async function getURI(
  id: string,
  uri: string,
  rawErrorOutput?: boolean
) {
  try {
    return prisma.uri.findFirst({
      where: {
        token: uri,
        guild_id: id,
      },
    });
  } catch (e) {
    error(false, errors.VALIDATE_SESSION_URI_FAIL, 500, rawErrorOutput);
  }
}

export async function getSessionURI(
  id: string,
  uri: string,
  rawErrorOutput?: boolean
) {
  try {
    return prisma.session_uri.findFirst({
      where: {
        token: uri,
        guild_id: id,
      },
    });
  } catch (e) {
    error(false, errors.VALIDATE_SESSION_URI_FAIL, 500, rawErrorOutput);
  }
}

export async function validateSessionURI(
  id: string,
  uri: string,
  rawErrorOutput?: boolean
) {
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
    error(false, errors.VALIDATE_SESSION_URI_FAIL, 500, rawErrorOutput);
  }
}

export async function getDBGuildEmbeds(
  id: string,
  uri: string,
  rawErrorOutput?: boolean
) {
  const session = await validateSessionURI(id, uri, rawErrorOutput);
  error(session, errors.VALIDATE_DB_GUILD_FAIL, 401, rawErrorOutput);
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
    error(false, errors.GET_GUILD_EMBEDS_FAIL, 500, rawErrorOutput);
  }
}
export async function getDBGuild(
  id: string,
  uri: string,
  rawErrorOutput?: boolean
) {
  const session = await validateSessionURI(id, uri, rawErrorOutput);
  error(session, errors.VALIDATE_DB_GUILD_FAIL, 401, rawErrorOutput);
  try {
    const guild = await prisma.guild.findFirst({
      where: {
        id,
      },
    });
    error(guild, errors.NO_GUILD_DB, 500, rawErrorOutput);
    return guild;
  } catch (e) {
    error(false, errors.FAIL_GUILD_DB, 500, rawErrorOutput);
  }
}

export async function toggleUM(
  id: string,
  enable: boolean,
  rawErrorOutput?: boolean
) {
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
    error(false, errors.TOGGLE_DB_UM_FAIL, 500, rawErrorOutput);
  }
}

export async function toggleRTM(
  id: string,
  enable: boolean,
  rawErrorOutput?: boolean
) {
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
    error(false, errors.TOGGLE_DB_RTM_FAIL, 500, rawErrorOutput);
  }
}

export async function updateRTMChannel(
  id: string,
  channelId: string,
  rawErrorOutput?: boolean
) {
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
    error(false, errors.UPDATE_DB_RTM_CHANNEL_FAIL, 500, rawErrorOutput);
  }
}

export async function updateUMLeaveChannel(
  id: string,
  channelId: string,
  rawErrorOutput?: boolean
) {
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
    error(false, errors.UPDATE_DB_UM_CHANNEL_FAIL, 500, rawErrorOutput);
  }
}

export async function updateUMLeaveMessage(
  id: string,
  message: string,
  rawErrorOutput?: boolean
) {
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
    error(false, errors.UPDATE_DB_UM_CHANNEL_FAIL, 500, rawErrorOutput);
  }
}

export async function updateUMLeaveMessageRAW(
  id: string,
  message: string,
  rawErrorOutput?: boolean
) {
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
    error(false, errors.UPDATE_DB_UM_MSG_FAIL, 500, rawErrorOutput);
  }
}

export async function updateUMWelcomeMessageRAW(
  id: string,
  message: string,
  rawErrorOutput?: boolean
) {
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
    error(false, errors.UPDATE_DB_UM_MSG_FAIL, 500, rawErrorOutput);
  }
}

export async function updateUMWelcomeMessage(
  id: string,
  message: string,
  rawErrorOutput?: boolean
) {
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
    error(false, errors.UPDATE_DB_UM_MSG_FAIL, 500, rawErrorOutput);
  }
}

export async function updateUMWelcomeChannel(
  id: string,
  channelId: string,
  rawErrorOutput?: boolean
) {
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
    error(false, errors.UPDATE_DB_UM_CHANNEL_FAIL, 500, rawErrorOutput);
  }
}
