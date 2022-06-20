import { useFetcher, useLocation } from "@remix-run/react";
import type { Params } from "react-router-dom";

export const useAPI = (params?: Readonly<Params<string>>) => {
  const fetcher = useFetcher();
  const { pathname } = useLocation();
  const request = (
    route:
      | "switchUser"
      | "removeMemberTimeout"
      | "timeoutMember"
      | "kickMember"
      | "banMember"
      | "removeInvite"
      | "createEmbed"
      | "toggleRTM"
      | "toggleUM"
      | "updateUM"
      | "updateRTMChannel"
      | "sendEmbed"
      | "removeBan"
      | "removePunishment"
      | "setTheme"
      | "removeEmbed",
    formData?: FormData
  ) => {
    let url: string;
    switch (route) {
      case "switchUser":
        url = `/${params?.guild}/${params?.uri}/api/switchUser`;
        break;
      case "timeoutMember":
        url = `/${params?.guild}/users/${params?.member}/api/timeout`;
        break;
      case "kickMember":
        url = `/${params?.guild}/users/${params?.member}/api/kick`;
        break;
      case "removeBan":
        url = `/${params?.guild}/users/${params?.member}/api/removeBan`;
        break;
      case "removePunishment":
        url = `/${params?.guild}/users/${params?.member}/api/removePunishment`;
        break;
      case "banMember":
        url = `/${params?.guild}/users/${params?.member}/api/ban`;
        break;
      case "removeMemberTimeout":
        url = `/${params?.guild}/users/${params?.member}/api/removeMemberTimeout`;
        break;
      case "createEmbed":
        url = `/${params?.guild}/api/createEmbed`;
        break;
      case "sendEmbed":
        url = `/${params?.guild}/api/sendEmbed`;
        break;
      case "updateRTMChannel":
        url = `/${params?.guild}/api/updateRTMChannel`;
        break;
      case "updateUM":
        url = `/${params?.guild}/api/updateUM`;
        break;
      case "toggleUM":
        url = `/${params?.guild}/api/toggleUM`;
        break;
      case "toggleRTM":
        url = `/${params?.guild}/api/toggleRTM`;
        break;
      case "removeEmbed":
        url = `/${params?.guild}/api/removeEmbed`;
        break;
      case "removeInvite":
        url = `/${params?.guild}/users/${params?.member}/api/removeInvite`;
        break;
      case "setTheme":
        url = "/api/setTheme";
        if (!formData) formData = new FormData();
        formData.append("pathname", pathname);
        break;
      default:
        url = "";
        break;
    }

    if (!formData) formData = new FormData();

    fetcher.submit(formData, {
      action: url,
      method: "post",
    });
  };

  return request;
};
