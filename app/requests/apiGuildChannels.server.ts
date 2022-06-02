import type { APIChannelBase } from "discord-api-types/v10";
import type { APIMessage } from "types/APIMessage";

export type APIGuildChannels = APIChannelBase<
  0 | 2 | 4 | 5 | 10 | 11 | 12 | 13 | 14 | 15
>[];

export const getAPIGuildChannels = async (
  id: string,
  uri: string
): Promise<APIMessage<APIGuildChannels>> => {
  try {
    // @ts-ignore
    return await (
      await fetch(`${process.env.API_URL}/${id}/get_channels`, {
        headers: {
          Authorization: uri,
        },
      })
    ).json();
  } catch {
    return { message: "Unknown Error", completed: false };
  }
};
