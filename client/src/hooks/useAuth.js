import { useCallback, useEffect, useState } from "react";

export default function useAuth() {
  const [user, setUser] = useState(null);

  const tryRefresh = useCallback(async () => {
    const res = await fetch("http://localhost:3000/refresh", {
      method: "POST",
      credentials: "include",
    });
    return res.ok;
  }, []);

  const getUser = useCallback(async () => {
    const fetchUser = async () => {
      const res = await fetch("http://localhost:3000/me", {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        return true;
      }
      return false;
    };

    const success = await fetchUser();
    if (success) return;

    const refreshed = await tryRefresh();
    if (!refreshed) return setUser(null);

    const retried = await fetchUser();
    if (!retried) setUser(null);
  }, [tryRefresh]);

  const login = useCallback(
    async (username, password) => {
      const res = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });
      if (res.ok) await getUser();
    },
    [getUser]
  );

  const logout = useCallback(async () => {
    await fetch("http://localhost:3000/logout", {
      method: "POST",
      credentials: "include",
    });
    setUser(null);
  }, []);

  useEffect(() => {
    getUser();
  }, [getUser]);

  return { user, login, logout, getUser };
}
