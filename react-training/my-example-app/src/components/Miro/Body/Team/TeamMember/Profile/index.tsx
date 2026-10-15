import Image from "../../../../Common/image";

const Profile = ({
  profileImage,
  name,
  profileIntro,
}: {
  profileImage: string;
  name: string;
  profileIntro: string;
}) => {
  return (
    <div className="mt-8 flex">
      <Image src={profileImage} alt="Profile" className="w-auto h-auto" />
      <div className="ml-4 font-light">
        <p>{name}</p>
        <p>{profileIntro}</p>
      </div>
    </div>
  );
}

export default Profile
