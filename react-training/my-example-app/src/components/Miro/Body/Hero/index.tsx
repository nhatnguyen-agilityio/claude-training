import Banner from "./Banner";
import SignUp from "./SignUp";

const Hero = () => {
  return (
    <div className="mt-15 mx-auto">
      <div className="container grid grid-cols-5">
        <SignUp />
        <Banner />
      </div>
    </div>
  );
}

export default Hero;
