import type DiscordEmbed from "types/DiscordEmbed";
import type { APIGuild } from "~/api-requests/apiGuild.server";
import type { DBGuild } from "~/models/dbGuild.server";
import { useAPI } from "~/shared-hooks/use-api";

export const useGuild = (guild: APIGuild | DBGuild | { id: string }) => {
  const request = useAPI({
    guild: guild.id,
  });

  const createEmbed = (embed: DiscordEmbed) => {
    let formData = new FormData();
    formData.append("embed", JSON.stringify(embed));
    request("createEmbed", formData);
  };
  const sendEmbed = (embed: DiscordEmbed, channelId: string | number) => {
    let formData = new FormData();
    formData.append("embed", JSON.stringify(embed));
    formData.append("channel_id", channelId.toString());
    request("sendEmbed", formData);
  };

  const toggleRTM = () => request("toggleRTM");
  const toggleUM = () => request("toggleUM");
  const updateUM = (um: {
    msg?: string;
    type: string;
    channel_id?: string | number;
  }) => {
    let formData = new FormData();
    um.msg && formData.append(`${um.type.toLowerCase()}_msg`, um.msg);
    um.channel_id &&
      formData.append(
        `${um.type.toLowerCase()}_channel`,
        um.channel_id.toString()
      );
    request("updateUM", formData);
  };
  const updateRTMChannel = (channel_id?: string) => {
    let formData = new FormData();
    formData.append("channel", channel_id ?? "");
    request("updateRTMChannel", formData);
  };

  const removeEmbed = (embedId: string | number) => {
    let formData = new FormData();
    formData.append("embed_id", embedId.toString());
    request("removeEmbed", formData);
  };

  return {
    removeEmbed,
    sendEmbed,
    createEmbed,
    toggleRTM,
    toggleUM,
    updateUM,
    updateRTMChannel,
  };
};
