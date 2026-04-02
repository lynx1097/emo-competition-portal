//create a hook to pull context of streams
import { useContext } from "react";
import { userContext } from "./StudentContext";

export function useStreams() {
  const context = useContext(userContext);

  return context;
}
