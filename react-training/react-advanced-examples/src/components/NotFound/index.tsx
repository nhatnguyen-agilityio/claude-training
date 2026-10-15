import notFoundImage from "@/assets/not-found.png"
import Image from "../common/Image";
import { Button } from "../ui/button";
import { NavLink } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="mt-10 flex flex-col items-center justify-center min-h-180 font-[OoohBaby]">
      <h2 className="text-6xl">OOPs</h2>
      <Image src={notFoundImage} alt="Not Found" className="w-100 h-auto" />
      <p className="text-6xl">404 - Page Not Found</p>
      <NavLink to="/">
        <Button className="bg-white w-25 h-12 mt-10 text-xl text-destructive border border-destructive rounded-sm hover:bg-destructive hover:text-background">Home</Button>
      </NavLink>

    </div>
  );
}

export default NotFound
