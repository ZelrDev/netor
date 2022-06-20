import type { Dispatch, SetStateAction } from "react";
import { useEffect, useState } from "react";

function useLocalStorage<S = undefined>(
  key: string,
  defaultValue: S
): [S, Dispatch<SetStateAction<S>>] {
  const [state, setState] = useState<S>(defaultValue);

  useEffect(() => {
    const _key: any = localStorage.getItem(key);
    setState(_key);
  }, [key]);

  const setWithLocalStorage: Dispatch<SetStateAction<S>> = (value) => {
    localStorage.setItem(key, value as any);
    setState(value);
  };

  return [state, setWithLocalStorage];
}

export default useLocalStorage;
