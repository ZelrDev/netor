import { Image, Text, useMantineTheme } from "@mantine/core";
import { useLocation } from "@remix-run/react";
import CoreTransparent from "~/media/branding/CoreTransparent.png";
export const Loading = (props: { loading: boolean }) => {
  const theme = useMantineTheme();
  const { pathname } = useLocation();
  return props.loading && pathname !== "/" ? (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background:
          theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.white,
        zIndex: 9999,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: 20,
      }}
    >
      <Image style={{ width: 160 }} src={CoreTransparent} />
      <Text
        size="xs"
        style={{
          letterSpacing: "0.1rem",
        }}
        weight={700}
      >
        INITIALIZING
      </Text>
    </div>
  ) : (
    <div></div>
  );
};
