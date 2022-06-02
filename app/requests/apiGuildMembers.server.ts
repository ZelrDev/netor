import type {
  APIGuildMember,
  RESTGetAPIGuildBansResult,
} from "discord-api-types/v10";
import type { APIMessage } from "types/APIMessage";

export type APIGuildMembers = APIGuildMember[];
export type APIGuildBannedMembers = RESTGetAPIGuildBansResult;

export const getAPIGuildBannedMembers = async (
  id: string,
  uri: string
): Promise<APIMessage<APIGuildBannedMembers>> => {
  try {
    // @ts-ignore
    return await (
      await fetch(`${process.env.API_URL}/${id}/get_banned_members`, {
        headers: {
          Authorization: uri,
        },
      })
    ).json();
  } catch {
    return { message: "Unknown Error", completed: false };
  }
};

export const getAPIGuildMembers = async (
  id: string,
  uri: string
): Promise<APIMessage<APIGuildMembers>> => {
  try {
    // @ts-ignore
    return await (
      await fetch(`${process.env.API_URL}/${id}/get_members`, {
        headers: {
          Authorization: uri,
        },
      })
    ).json();
  } catch {
    return { message: "Unknown Error", completed: false };
  }
};
