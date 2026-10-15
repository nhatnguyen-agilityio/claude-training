import Image from "../../../../Common/image";
import Profile from "../Profile";

const Member = ({
  companyImage,
  profileSrc,
  name,
  description,
  profileIntro,
}: {
  companyImage: string;
  profileSrc: string;
  name: string;
  description: string;
  profileIntro: string;
}) => {
  return (
    <div className="flex flex-col text-left my-10">
      <Image alt={"Company"} src={companyImage} className={""} />
      <p className="text-lg mt-3 h-50 font-light">{description}</p>
      <Profile profileImage={profileSrc} name={name} profileIntro={profileIntro} />
    </div>
  );
};

export default Member
