"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiService } from "@/services/api";

const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => {
    // get token (verify if its client side)
    return typeof window !== "undefined" ? localStorage.getItem("token") : null;
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (storedToken && storedUser) {
      setToken(storedToken);
      //since its string we convert to object
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const loginAction = async (data) => {
    try {
      const response = await apiService.login(data);
      if (response) {
        setToken(response.jwtToken);
        setUser(response.author);
        setIsAuthenticated(true);
        //localStorage only saves string, so we store in json string then when we get we must convert string to object in useEffect
        localStorage.setItem("token", response.jwtToken);
        localStorage.setItem("user", JSON.stringify(response.author));
        router.push("/");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const registerAction = async (data) => {
    try {
      const response = await apiService.register(data);
      if (response) {
        setToken(response.jwtToken);
        setUser(response.author);
        setIsAuthenticated(true);
        localStorage.setItem("token", response.jwtToken);
        localStorage.setItem("user", JSON.stringify(response.author));
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
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    router.push("/");
  };
  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loginAction,
        registerAction,
        logoutAction,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(AuthContext);
};
