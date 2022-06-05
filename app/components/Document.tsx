import {
  Links,
  LiveReload,
  Meta,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import type { ColorScheme } from "@mantine/core";
import { MantineProvider, ColorSchemeProvider } from "@mantine/core";
import { getCache } from "@mantine/core";
import { useContext, useEffect } from "react";
import { ClientStyleContext } from "~/context";
import { useColorScheme } from "@mantine/hooks";
import useLocalStorage from "~/hooks/useLocalStorage";
import { ModalsProvider } from "@mantine/modals";
import { NotificationsProvider } from "@mantine/notifications";

interface DocumentProps {
  children: React.ReactNode;
}
export function MantineTheme({ children }: { children: React.ReactNode }) {
  const preferredColorScheme = useColorScheme(undefined);

  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme | "system">(
    "color-scheme",
    "system"
  );
  useEffect(() => {
    if (colorScheme == null) setColorScheme("system");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [colorScheme]);

  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));

  return (
    <ColorSchemeProvider
      colorScheme={
        colorScheme === "system" ? preferredColorScheme : colorScheme
      }
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider
        theme={{
          colorScheme:
            colorScheme === "system" ? preferredColorScheme : colorScheme,
          primaryColor: "indigo",
        }}
        withNormalizeCSS
        withGlobalStyles
      >
        <ModalsProvider>
          <NotificationsProvider>{children}</NotificationsProvider>
        </ModalsProvider>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}

export function Document({ children }: DocumentProps) {
  const clientStyleData = useContext(ClientStyleContext);

  useEffect(() => {
    const cache = getCache({ key: "mantine" });
    cache.sheet.container = document.head;
    const tags = cache.sheet.tags;
    cache.sheet.flush();
    tags.forEach((tag) => {
      (cache.sheet as any)._insertTag(tag);
    });
    clientStyleData?.reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <MantineTheme>{children}</MantineTheme>
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === "development" && <LiveReload />}
      </body>
    </html>
  );
}
