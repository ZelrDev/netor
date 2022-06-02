import { APIUser } from "discord-api-types/v10";
import { APIMessage } from "types/APIMessage";

export type { APIUser } from "discord-api-types/v10";

export const getAPIUser = async (
  guild_id: string,
  user_id: string,
  uri: string
): Promise<APIMessage<APIUser>> => {
  try {
    // @ts-ignore
    return await (
      await fetch(`${process.env.API_URL}/${guild_id}/get_user/${user_id}`, {
        headers: {
          Authorization: uri,
          "Special-Authorization": process.env.SPECIAL_AUTH!,
        },
      })
    ).json();
  } catch {
    return await { message: "Unknown Error", completed: false };
  }
};
