import { useEffect, useState, type ReactNode } from "react";
import { AuthContext } from "./AuthContext";
import type { signUpData } from "../types/SignUp";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<{ username: string; password: string, email: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("authUser") || sessionStorage.getItem("authUser");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (username: string, password: string, rememberMe: boolean): Promise<boolean> => {
    try{
      // It not secure to send password in url, but current example is simple and using mockapi so do not have any custom api to do it
      const response = await fetch(`https://683417dd464b499636014699.mockapi.io/api/v1/users?username=${username}&password=${password}`)

      // Return false if the user is not found
      if (!response.ok) {
        return false;
      }

      const data = await response.json();

      // Set user if user is exists
      if (data.length > 0) {
        const userData = { username: data[0].username, password: data[0].password, email: data[0].email };
        setUser(userData);

        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem("authUser", JSON.stringify(userData));

        return true;
      }
      return false;
    }
    catch (error) {
      console.log(error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("authUser");
    sessionStorage.removeItem("authUser");
    localStorage.removeItem("rememberUsername");
  };

  const signUp = async ({ firstName, lastName, username, email, password }: signUpData): Promise<boolean> => {
    try {
      const response = await fetch("https://683417dd464b499636014699.mockapi.io/api/v1/users", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName,
          lastName,
          username,
          email,
          password,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create user');
      }
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, signUp, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
