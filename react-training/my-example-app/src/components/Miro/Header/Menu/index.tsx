import Contact from "./Contact";
import Language from "./Language";
import Login from "./Login";
import SignUp from "./SignUp";

const Menu = () => {
  return (
    <div className="flex items-center mr-8 mx-auto h-full justify-center">
      <Language />
      <Contact />
      <Login />
      <SignUp />
    </div>
  );
}
export default Menu;
