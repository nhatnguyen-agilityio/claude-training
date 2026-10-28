import { createContext, useState } from "react";
import Form from "./Form";
import Button from "./Button";

const ThemeContext = createContext<string | null>(null);

export default function ContextExample() {
  const [theme, setTheme] = useState("dark");

  return (
    <ThemeContext.Provider value={theme}>
      <Form />
      <Button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>Switch to the {theme === "dark" ? "light" : "dark"} theme</Button>
    </ThemeContext.Provider>
  );
}

export { ThemeContext };
