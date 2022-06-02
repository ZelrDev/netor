import type { APIRole } from "discord-api-types/v10";
import { APIMessage } from "types/APIMessage";

export type APIGuildRoles = APIRole[];

export const getAPIGuildRoles = async (
  id: string,
  uri: string
): Promise<APIMessage<APIGuildRoles>> => {
  try {
    // @ts-ignore
    return await (
      await fetch(`${process.env.API_URL}/${id}/get_roles`, {
        headers: {
          Authorization: uri,
        },
      })
    ).json();
  } catch {
    return await { message: "Unknown Error", completed: false };
  }
};
