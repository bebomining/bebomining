import { useContext } from "react";
import { AppContext } from "./../contexts";

export function useAppContext() {
  const appContext = useContext(AppContext);
  return appContext;
}
