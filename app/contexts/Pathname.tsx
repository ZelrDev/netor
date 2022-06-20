import { createContext } from "react";

export type PathnameContextType = {
  pathname?: string | null;
  setPathname: Function;
};

export const PathnameContext = createContext<PathnameContextType>({
  pathname: undefined,
  setPathname: () => {},
});

export const PathnameContextProvider = PathnameContext.Provider;
