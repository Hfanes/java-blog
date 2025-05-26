"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/services/api";

const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);
    }
  }, []);

  const loginAction = async (data) => {
    try {
      const response = await api.login(data);
      if (response) {
        setToken(response.jwtToken);
        setIsAuthenticated(true);
        localStorage.setItem("token", response.jwtToken);
        router.push("/");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const logoutAction = () => {
    setUser(null);
    setToken("");
    setIsAuthenticated(false);

    localStorage.removeItem("token");
    router.push("/");
  };
  return (
    <AuthContext.Provider
      value={{ user, token, loginAction, logoutAction, isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(AuthContext);
};
