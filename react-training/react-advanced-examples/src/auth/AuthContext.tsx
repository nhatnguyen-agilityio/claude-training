import { createContext } from "react";
import type { signUpData } from "../types/SignUp";

export type AuthContextType = {
  user: { username: string; password: string, email: string } | null;
  login: (username: string, password: string, rememberMe: boolean) => Promise<boolean>;
  logout: () => void;
  signUp: (data: signUpData) => Promise<boolean>;
  loading: boolean;
};

export const AuthContext = createContext<AuthContextType | null>(null)
