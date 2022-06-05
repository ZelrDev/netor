import { prisma } from "~/db.server";
import type { punishment, user_invite } from "@prisma/client";
import { APIUser } from "discord-api-types/v10";
import { getAPIUser } from "~/requests/apiUser";
import { error } from "~/utils";
import errors from "~/errors.json";

export interface DBGuildMemberPunishment extends punishment {
  punisher?: APIUser;
}
export interface DBGuildMemberInvite extends user_invite {
  joined?: APIUser;
}
export type DBGuildMemberInvites = DBGuildMemberInvite[];
export type DBGuildMemberPunishments = DBGuildMemberPunishment[];

export type DBGuildMemberPunishmentRAW = punishment;
export type DBGuildMemberPunishmentsRAW = punishment[];

export type DBGuildPunishmentRAW = punishment;
export type DBGuildPunishmentsRAW = punishment[];

export type DBGuildMemberInviteRAW = user_invite;
export type DBGuildMemberInvitesRAW = user_invite[];

export const getDBGuildPunishmentsRAW = async (
  guildId: string,
  rawErrorOutput?: boolean
) => {
  try {
    return prisma.punishment.findMany({
      where: {
        guild_id: guildId,
      },
    });
  } catch {
    error(false, errors.GET_DB_PUNISHMENTS_FAIL, 500, rawErrorOutput);
  }
};

export const getDBGuildMemberInvitesRAW = async (
  guildId: string,
  userId: string,
  rawErrorOutput?: boolean
) => {
  try {
    return prisma.user_invite.findMany({
      where: {
        guild_id: guildId,
        inviter_id: userId,
      },
    });
  } catch {
    error(false, errors.GET_DB_INVITES_FAIL, 500, rawErrorOutput);
  }
};

export const getDBGuildMemberPunishmentsRAW = async (
  guildId: string,
  userId: string,
  rawErrorOutput?: boolean
) => {
  try {
    return prisma.punishment.findMany({
      where: {
        guild_id: guildId,
        user_id: userId,
      },
    });
  } catch {
    error(false, errors.GET_DB_PUNISHMENTS_FAIL, 500, rawErrorOutput);
  }
};

export const removeDBGuildMemberInvite = async (
  inviteId: string,
  rawErrorOutput?: boolean
) => {
  try {
    return prisma.user_invite.delete({
      where: {
        id: inviteId,
      },
    });
  } catch {
    error(false, errors.DELETE_DB_INVITE_FAIL, 500, rawErrorOutput);
  }
};

export const removeDBGuildMemberPunishment = async (
  punishmentId: string,
  rawErrorOutput?: boolean
) => {
  try {
    return prisma.punishment.delete({
      where: {
        id: punishmentId,
      },
    });
  } catch {
    error(false, errors.DELETE_DB_PUNISHMENT_FAIL, 500, rawErrorOutput);
  }
};

export const getDBGuildMemberPunishments = async (
  guildId: string,
  userId: string,
  uri: string,
  rawErrorOutput?: boolean
) => {
  try {
    let punisherIds: string[] = [];
    let punishers: APIUser[] = [];
    let punishments = await prisma.punishment.findMany({
      where: {
        guild_id: guildId,
        user_id: userId,
      },
    });

    punishments.forEach(
      (punishment) =>
        !punisherIds.includes(punishment.punisher_id) &&
        punisherIds.push(punishment.punisher_id)
    );

    for (const item of punisherIds) {
      const user = await getAPIUser(guildId, item, uri);

      if (user.completed === true) {
        punishers.push(user.result!);
      }
    }

    const newPunishments: DBGuildMemberPunishments = punishments.map(
      ({ punisher_id, ...punishment }) => ({
        ...punishment,
        punisher_id,
        punisher: punishers.find((user) => user.id === punisher_id),
      })
    );

    return newPunishments;
  } catch {
    error(false, errors.GET_DB_PUNISHMENTS_FAIL, 500, rawErrorOutput);
  }
};

export const getDBGuildMemberInvites = async (
  guildId: string,
  userId: string,
  uri: string,
  rawErrorOutput?: boolean
) => {
  try {
    let joinedIds: string[] = [];
    let joined: APIUser[] = [];
    let invites = await prisma.user_invite.findMany({
      where: {
        guild_id: guildId,
        inviter_id: userId,
      },
    });

    invites.forEach(
      (invite) =>
        !joinedIds.includes(invite.joined_id) &&
        joinedIds.push(invite.joined_id)
    );

    for (const item of joinedIds) {
      const user = await getAPIUser(guildId, item, uri);

      if (user.completed === true) {
        joined.push(user.result!);
      }
    }

    const newInvites: DBGuildMemberInvites = invites.map(
      ({ joined_id, ...punishment }) => ({
        ...punishment,
        joined_id,
        joined: joined.find((user) => user.id === joined_id),
      })
    );

    return newInvites;
  } catch {
    error(false, errors.GET_DB_INVITES_FAIL, 500, rawErrorOutput);
  }
};
