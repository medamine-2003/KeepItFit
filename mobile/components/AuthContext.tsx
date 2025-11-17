import React, { createContext, useState, useEffect, ReactNode } from "react";
import * as SecureStore from "expo-secure-store";
import api from "../utils/api";

interface AuthContextType {
  token: string | null;
  user: any | null;
  signIn: (token: string) => Promise<void>;
  signOut: () => Promise<void>;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  token: null,
  user: null,
  signIn: async () => {},
  signOut: async () => {},
  isLoading: true,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadToken();
  }, []);

  const loadToken = async () => {
    try {
      const storedToken = await SecureStore.getItemAsync("userToken");
      if (storedToken) {
        setToken(storedToken);
        api.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
        await fetchUser(storedToken);
      }
    } catch (error) {
      console.error("Error loading token:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUser = async (authToken: string) => {
    try {
      const response = await api.get("/auth/me", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching user:", error);
      await signOut();
    }
  };

  const signIn = async (newToken: string) => {
    try {
      await SecureStore.setItemAsync("userToken", newToken);
      setToken(newToken);
      api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
      await fetchUser(newToken);
    } catch (error) {
      // Silent error - sign in failed
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await SecureStore.deleteItemAsync("userToken");
      setToken(null);
      setUser(null);
      delete api.defaults.headers.common["Authorization"];
    } catch (error) {
      // Silent error - sign out failed
    }
  };

  return (
    <AuthContext.Provider value={{ token, user, signIn, signOut, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}
