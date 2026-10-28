import { useContext } from "react";
import type { AuthContextType } from "../../auth/AuthContext";
import { AuthContext } from "../../auth/AuthContext";

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
