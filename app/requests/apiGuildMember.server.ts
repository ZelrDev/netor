import type { APIGuildMember } from "discord-api-types/v10";
export type { APIGuildMember } from "discord-api-types/v10";
import type { APIMessage } from "types/APIMessage";
import type { APIBan } from "discord-api-types/v10";

export type APIGuildMemberBan = APIBan | null;

export const getAPIGuildMember = async (
  id: string,
  uri: string,
  memberId: string
): Promise<APIMessage<APIGuildMember>> => {
  try {
    // @ts-ignore
    return await (
      await fetch(`${process.env.API_URL}/${id}/get_member/${memberId}`, {
        headers: {
          Authorization: uri,
        },
      })
    ).json();
  } catch {
    return { message: "Unknown Error", completed: false };
  }
};

export const getAPIGuildMemberBan = async (
  id: string,
  uri: string,
  memberId: string
): Promise<APIMessage<APIGuildMemberBan>> => {
  try {
    // @ts-ignore
    return await (
      await fetch(`${process.env.API_URL}/${id}/get_member_ban/${memberId}`, {
        headers: {
          Authorization: uri,
        },
      })
    ).json();
  } catch {
    return { message: "Unknown Error", completed: false };
  }
};

export const removeBanAPIGuildMember = async (
  id: string,
  uri: string,
  memberId: string
): Promise<APIMessage<boolean>> => {
  try {
    // @ts-ignore
    return await (
      await fetch(
        `${process.env.API_URL}/${id}/remove_member_ban/${memberId}`,
        {
          headers: {
            Authorization: uri,
          },
          method: "POST",
        }
      )
    ).json();
  } catch {
    return { completed: false, message: "Unknown Error" };
  }
};

export const removeTimeoutAPIGuildMember = async (
  id: string,
  uri: string,
  memberId: string
): Promise<APIMessage<boolean>> => {
  try {
    // @ts-ignore
    return await (
      await fetch(
        `${process.env.API_URL}/${id}/remove_member_timeout/${memberId}`,
        {
          headers: {
            Authorization: uri,
          },
          method: "POST",
        }
      )
    ).json();
  } catch {
    return { completed: false, message: "Unknown Error" };
  }
};

export const timeoutAPIGuildMember = async (
  id: string,
  uri: string,
  memberId: string,
  reason: string,
  timeMS: string | number
): Promise<APIMessage<boolean>> => {
  try {
    // @ts-ignore
    return await (
      await fetch(
        `${process.env.API_URL}/${id}/timeout_member/${memberId}/${reason}/${timeMS}`,
        {
          headers: {
            Authorization: uri,
          },
          method: "POST",
        }
      )
    ).json();
  } catch {
    return { completed: false, message: "Unknown Error" };
  }
};

export const kickAPIGuildMember = async (
  id: string,
  uri: string,
  memberId: string,
  reason: string
): Promise<APIMessage<boolean>> => {
  try {
    // @ts-ignore
    return await (
      await fetch(
        `${process.env.API_URL}/${id}/kick_member/${memberId}/${reason}`,
        {
          headers: {
            Authorization: uri,
          },
          method: "POST",
        }
      )
    ).json();
  } catch {
    return { completed: false, message: "Unkown Error" };
  }
};

export const banAPIGuildMember = async (
  id: string,
  uri: string,
  memberId: string,
  reason: string
): Promise<APIMessage<boolean>> => {
  try {
    // @ts-ignore
    return await (
      await fetch(
        `${process.env.API_URL}/${id}/ban_member/${memberId}/${reason}`,
        {
          headers: {
            Authorization: uri,
          },
          method: "POST",
        }
      )
    ).json();
  } catch {
    return { completed: false, message: "Unknown Error" };
  }
};
