import { createContext, useState } from "react";
import Main from "./Main";
import ErrorBoundary from "../ErrorBoundary";

type ThemeContextType = {
  screenTheme: string;
  setScreenTheme: (theme: string) => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);
const DarkMode = () => {
  const [screenTheme, setScreenTheme] = useState("light");

  return (
    <ErrorBoundary>
      <ThemeContext.Provider value={{ screenTheme, setScreenTheme }}>
        <Main />
      </ThemeContext.Provider>
    </ErrorBoundary>
  );
}

export default DarkMode
export { ThemeContext }
