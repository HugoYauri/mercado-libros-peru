import { useContext } from "react";
import { SessionContext } from "../context/session.js";
export function useSession() {
  return useContext(SessionContext);
}
