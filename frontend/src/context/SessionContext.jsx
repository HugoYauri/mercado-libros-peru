import { useState } from "react";
import { SessionContext } from "./session.js";
import { services } from "../services/index.js";
export function SessionProvider({ children }) {
  const [user, setUser] = useState(() => services.getSession());
  const loginDemo = async (id) => {
    const u = await services.loginDemo(id);
    setUser(u);
  };
  const logout = async () => {
    await services.logout();
    setUser(null);
  };
  return (
    <SessionContext.Provider value={{ user, loginDemo, logout }}>
      {children}
    </SessionContext.Provider>
  );
}
