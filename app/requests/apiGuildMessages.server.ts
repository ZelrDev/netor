import { APIMessage } from "types/APIMessage";
import DiscordEmbed from "types/DiscordEmbed";

export const sendMessageEmbed = async (
  id: string,
  uri: string,
  channelId: string,
  embed: DiscordEmbed
): Promise<APIMessage<boolean>> => {
  try {
    let formData = new FormData();
    formData.append("embed_string", JSON.stringify(embed));
    // @ts-ignore
    return await (
      await fetch(
        `${process.env.API_URL}/${id}/send_message_embed/${channelId}`,
        {
          body: formData,
          method: "POST",
          headers: {
            Authorization: uri,
          },
        }
      )
    ).json();
  } catch {
    return { message: "Unknown Error", completed: false };
  }
};
