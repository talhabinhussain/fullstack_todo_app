"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { TokenManager } from "@/utils/token-manager";

interface AuthContextType {
  user: any | null;
  token: string | null;
  login: (
    email: string,
    password: string,
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  register: (
    email: string,
    password: string,
  ) => Promise<{ success: boolean; error?: string }>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check for existing session on component mount
    const storedToken = TokenManager.getAccessToken();
    const storedUser = localStorage.getItem("auth-user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      const parsedUser = JSON.parse(storedUser);
      
      // Ensure the user object has an ID property
      if (!parsedUser.id) {
        // If no ID in stored user, decode from token
        const tokenPayload = TokenManager.decodeToken(storedToken);
        if (tokenPayload && tokenPayload.sub) {
          const userId = tokenPayload.sub;
          setUser({ id: userId, email: parsedUser.email });
        } else {
          setUser(parsedUser);
        }
      } else {
        setUser(parsedUser);
      }
    }

    setLoading(false);
  }, []);

  const login = async (
    email: string,
    password: string,
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const apiUrl =
        process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
      const response = await fetch(`${apiUrl}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        // Decode the token to get the user ID from the JWT payload
        const tokenPayload = TokenManager.decodeToken(data.access_token);
        if (!tokenPayload || !tokenPayload.sub) {
          console.error('Could not extract user ID from token');
          return { success: false, error: "Authentication error: Could not extract user ID" };
        }
        const userId = tokenPayload.sub; // 'sub' field contains the user ID
        
        console.log('Setting user with ID:', userId); // Debug log
        setToken(data.access_token);
        setUser({ id: userId, email });
        TokenManager.storeTokens(data.access_token);
        localStorage.setItem("auth-user", JSON.stringify({ id: userId, email }));
        return { success: true };
      }

      // Extract error message from backend
      try {
        const errorData = await response.json();
        return { success: false, error: errorData.detail || "Login failed" };
      } catch {
        return { success: false, error: "Login failed. Please try again." };
      }
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: "Network error. Please try again." };
    }
  };

  const register = async (
    email: string,
    password: string,
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const apiUrl =
        process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
      console.log("Registering user at:", `${apiUrl}/api/auth/register`);

      const response = await fetch(`${apiUrl}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        // Decode the token to get the user ID from the JWT payload
        const tokenPayload = TokenManager.decodeToken(data.access_token);
        if (!tokenPayload || !tokenPayload.sub) {
          console.error('Could not extract user ID from token');
          return { success: false, error: "Authentication error: Could not extract user ID" };
        }
        const userId = tokenPayload.sub; // 'sub' field contains the user ID
        
        console.log('Setting user with ID:', userId); // Debug log
        setToken(data.access_token);
        setUser({ id: userId, email });
        TokenManager.storeTokens(data.access_token);
        localStorage.setItem("auth-user", JSON.stringify({ id: userId, email }));
        return { success: true };
      }

      // Extract error message from backend
      try {
        const errorData = await response.json();
        console.error("Backend error:", errorData);
        return {
          success: false,
          error: errorData.detail || "Registration failed",
        };
      } catch {
        console.error(
          "Failed to parse error response, status:",
          response.status,
        );
        return {
          success: false,
          error: "Registration failed. Please try again.",
        };
      }
    } catch (error) {
      console.error("Registration network error:", error);
      return { success: false, error: "Network error. Please try again." };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    TokenManager.removeTokens();
    localStorage.removeItem("auth-user");
  };

  const value = {
    user,
    token,
    login,
    logout,
    register,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
