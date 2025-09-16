import { jwtDecode } from "jwt-decode";
import { createContext, useMemo, useState } from "react";

export const userContext = createContext();

export default function UserContextProvider({ children }) {
  // Initialize from localStorage once
  const [userLogin, setUserLogin] = useState(() =>
    localStorage.getItem("userToken")
  );
  const [userName, setUserName] = useState(() =>
    localStorage.getItem("userName")
  );

  // ✅ Derive userId directly from token instead of storing separately
  const userId = useMemo(() => {
    if (!userLogin) return null;
    try {
      const decoded = jwtDecode(userLogin);
      return decoded?.id || null;
    } catch {
      return null;
    }
  }, [userLogin]);

  // ✅ Stable value for context consumers
  const contextValue = useMemo(
    () => ({
      userName,
      userId,
      userLogin,
      setUserLogin,
      setUserName,
    }),
    [userName, userId, userLogin]
  );

  return (
    <userContext.Provider value={contextValue}>{children}</userContext.Provider>
  );
}
