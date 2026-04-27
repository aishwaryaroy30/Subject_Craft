import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { authAPI } from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    const token = localStorage.getItem("sc_token");
    const cached = localStorage.getItem("sc_user");
    if (token && cached) {
      setUser(JSON.parse(cached));
      // Verify token is still valid
      authAPI.getMe()
        .then(res => { setUser(res.data.user); localStorage.setItem("sc_user", JSON.stringify(res.data.user)); })
        .catch(() => logout())
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email, password) => {
    const res = await authAPI.login({ email, password });
    const { token, user } = res.data;
    localStorage.setItem("sc_token", token);
    localStorage.setItem("sc_user", JSON.stringify(user));
    setUser(user);
    return user;
  }, []);

  const register = useCallback(async (name, email, password) => {
    const res = await authAPI.register({ name, email, password });
    const { token, user } = res.data;
    localStorage.setItem("sc_token", token);
    localStorage.setItem("sc_user", JSON.stringify(user));
    setUser(user);
    return user;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("sc_token");
    localStorage.removeItem("sc_user");
    setUser(null);
  }, []);

  const updateUser = useCallback((updated) => {
    setUser(updated);
    localStorage.setItem("sc_user", JSON.stringify(updated));
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};