import { Text, Title } from "@mantine/core";
import { useEffect, useState } from "react";

export const DevBuild = () => {
  const [devBuild, setDevBuild] = useState(false);

  useEffect(() => {
    if ((window as any).ENV.DEV_BUILD) {
      setDevBuild(true);
    }
  }, []);

  return devBuild ? (
    <div
      style={{
        position: "absolute",
        bottom: 50,
        right: 50,
        opacity: "20%",
        zIndex: 9999,
      }}
    >
      <Title order={1}>DEV_BUILD</Title>
    </div>
  ) : (
    <div></div>
  );
};
