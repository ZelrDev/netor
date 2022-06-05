import { Text, Title } from "@mantine/core";
import { useEffect, useState } from "react";

export const DevBuild = () => {
  return process.env.NODE_ENV === "development" ? (
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
