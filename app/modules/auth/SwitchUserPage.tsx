import { useLoaderData } from "@remix-run/react";
import type { LoaderData } from "./loaderData";
import { SwitchUser as SwitchUserUI } from "~/ui/SwitchUser";
import { useSwitchUser } from "./use-switch-user";

export const SwitchUser = () => {
  const loaderData = useLoaderData() as LoaderData;
  return <SwitchUserUI switchUser={useSwitchUser} {...loaderData} />;
};
