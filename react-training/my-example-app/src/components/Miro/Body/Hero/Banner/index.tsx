import Image from "../../../Common/image";
import bannerImage from "../../../assets/banner.png";

const Banner = () => {
  return (
    <div className="col-span-3 flex justify-end">
      <Image src={bannerImage} alt="Banner" className="w-auto h-auto" />
    </div>
  );
}

export default Banner;
