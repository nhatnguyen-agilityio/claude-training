import languageIcon from "../../../assets/language.png"
import Image from "../../../Common/image";

const Language = () => {
  return (
    <div className="group flex mx-auto h-full justify-center items-center text-center">
      <Image src={languageIcon} alt="Language" className="w-6 h-6 mr-1" />
      <p className="text-4 mr-4 group-hover:underline">EN</p>
    </div>
  );
};

export default Language;
