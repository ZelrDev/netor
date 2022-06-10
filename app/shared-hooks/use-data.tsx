import { useLoaderData, useOutletContext } from "@remix-run/react";

export const useData = () => {
  const loaderData = useLoaderData();
  const contextData: any = useOutletContext();
  return { ...loaderData, ...contextData };
};
