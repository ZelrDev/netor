import { APIGuild } from "discord-api-types/v10";
import type { APIMessage } from "types/APIMessage";

export type { APIGuild } from "discord-api-types/v10";

export const getAPIGuild = async (
  id: string,
  uri: string
): Promise<APIMessage<APIGuild>> => {
  try {
    // @ts-ignore
    return await (
      await fetch(`${process.env.API_URL}/${id}/get_guild`, {
        headers: {
          Authorization: uri,
        },
      })
    ).json();
  } catch {
    return { message: "Unknown Error", completed: false };
  }
};
