import { createContext, useContext, useState, useEffect, useCallback } from "react";
import * as authApi from "../api/authApi";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      const token = localStorage.getItem("jobtracker_token");

      if (!token) {
        if (!cancelled) setLoading(false);
        return;
      }

      // Show cached data immediately so the UI isn't empty while we verify,
      // but we do NOT stop "loading" until the real server response lands.
      const cachedUser = localStorage.getItem("jobtracker_user");
      if (cachedUser) {
        try {
          if (!cancelled) setUser(JSON.parse(cachedUser));
        } catch {
          // corrupted cache, ignore and let the server fetch fill it in
        }
      }

      try {
        const { data } = await authApi.getProfile();
        if (!cancelled) {
          setUser(data);
          localStorage.setItem("jobtracker_user", JSON.stringify(data));
        }
      } catch (err) {
        if (!cancelled) {
          localStorage.removeItem("jobtracker_token");
          localStorage.removeItem("jobtracker_user");
          setUser(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    init();

    return () => {
      cancelled = true;
    };
  }, []);

  const login = async (email, password) => {
    const { data } = await authApi.loginUser({ email, password });
    const { token, ...userData } = data;
    localStorage.setItem("jobtracker_token", token);
    localStorage.setItem("jobtracker_user", JSON.stringify(userData));
    setUser(userData);

    // Immediately follow up with a full profile fetch so every field
    // (skills, projects, resume, photo) is present before navigation,
    // not just the slim payload the login endpoint returns.
    try {
      const { data: fullProfile } = await authApi.getProfile();
      setUser(fullProfile);
      localStorage.setItem("jobtracker_user", JSON.stringify(fullProfile));
      return fullProfile;
    } catch {
      return userData;
    }
  };

  const register = async (name, email, password) => {
    const { data } = await authApi.registerUser({ name, email, password });
    const { token, ...userData } = data;
    localStorage.setItem("jobtracker_token", token);
    localStorage.setItem("jobtracker_user", JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem("jobtracker_token");
    localStorage.removeItem("jobtracker_user");
    setUser(null);
  };

  const refreshUser = useCallback(async () => {
    const { data } = await authApi.getProfile();
    setUser(data);
    localStorage.setItem("jobtracker_user", JSON.stringify(data));
    return data;
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
