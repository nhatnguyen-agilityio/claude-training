import miroLogo from "../../assets/miro.png";
import Image from "../../Common/image";


const Logo = () => {
  return (
    <h1 className="h-full flex items-center mx-8">
      <a href="#">
        <Image
          src={miroLogo}
          alt="Logo"
          className="h-auto w-auto"
        />
      </a>
    </h1>
  );
}

export default Logo;
