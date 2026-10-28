import Image from "../../../../Common/image";

const Banner = ({ bannerImage }: { bannerImage: string }) => {
  return (
    <div className="col-span-3 flex justify-end">
      <Image src={bannerImage} alt="Banner" className="w-auto h-auto" />
    </div>
  );
}

export default Banner;
