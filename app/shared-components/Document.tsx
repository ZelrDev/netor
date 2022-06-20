import {
  Links,
  LiveReload,
  Meta,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useLocation,
} from "@remix-run/react";
import type { ColorScheme } from "@mantine/core";
import { MantineProvider, ColorSchemeProvider } from "@mantine/core";
import { getCache } from "@mantine/core";
import { useContext, useEffect, useState } from "react";
import { ClientStyleContext } from "~/context";
import { useColorScheme } from "@mantine/hooks";
import useLocalStorage from "~/shared-hooks/use-local-storage";
import { ModalsProvider } from "@mantine/modals";
import { NotificationsProvider } from "@mantine/notifications";
import { useTranslation } from "react-i18next";
import { useChangeLanguage } from "remix-i18next";
import { PathnameContextProvider } from "~/contexts/Pathname";
import { useAPI } from "~/shared-hooks/use-api";

interface DocumentProps {
  children: React.ReactNode;
  error?: boolean;
}

type LoaderData = {
  locale: string;
  userPrefs: { theme: undefined | "dark" | "light" | "system" };
};

export function MantineTheme({
  children,
  error,
}: {
  children: React.ReactNode;
  error?: boolean;
}) {
  const preferredColorScheme = useColorScheme(undefined);
  let userPrefs: { theme: undefined | "dark" | "light" | "system" } | null = {
    theme: "system",
  };
  // eslint-disable-next-line react-hooks/rules-of-hooks
  if (!error) userPrefs = useLoaderData().userPrefs;

  const api = useAPI();

  useEffect(() => {
    if (userPrefs?.theme == undefined) {
      let formData = new FormData();
      formData.append("theme", "system");
      api("setTheme", formData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userPrefs]);
  const toggleColorScheme = (value?: ColorScheme) => {
    let formData = new FormData();
    formData.append(
      "theme",
      value || userPrefs?.theme === "dark" ? "light" : "dark"
    );
    api("setTheme", formData);
  };
  return (
    <ColorSchemeProvider
      colorScheme={
        userPrefs?.theme === "system"
          ? preferredColorScheme
          : userPrefs?.theme === undefined
          ? preferredColorScheme
          : userPrefs?.theme
      }
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider
        theme={{
          colorScheme:
            userPrefs?.theme === "system"
              ? preferredColorScheme
              : userPrefs?.theme,
          primaryColor: "indigo",
          fontFamily: "Inter var, sans-serif",
          headings: { fontFamily: "Inter var, sans-serif" },
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

export function Document({ children, error }: DocumentProps) {
  const clientStyleData = useContext(ClientStyleContext);
  let locale = "";
  // eslint-disable-next-line react-hooks/rules-of-hooks
  if (!error) locale = useLoaderData<LoaderData>().locale;
  else locale = "en";

  let { i18n } = useTranslation();
  const [pathname, setPathname] = useState<string>("");
  const location = useLocation();
  useChangeLanguage(locale);

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

  useEffect(() => {
    setPathname(location.pathname);
  }, [location.pathname]);

  return (
    <html lang={locale} dir={i18n.dir()}>
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <MantineTheme error={error}>
          <PathnameContextProvider value={{ pathname, setPathname }}>
            {children}
          </PathnameContextProvider>
        </MantineTheme>
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === "development" && <LiveReload />}
      </body>
    </html>
  );
}
