import Button from "../Button";
import { ThemeContext } from "..";

export default function Form() {
  return (
    <ThemeContext.Provider value="blue">
      <Button>Sign up</Button>
      <Button>Log in</Button>
    </ThemeContext.Provider>
  );
};
