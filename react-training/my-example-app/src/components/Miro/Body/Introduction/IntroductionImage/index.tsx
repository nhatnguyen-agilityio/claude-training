import Image from "../../../Common/image";

const IntroductionImage = ({ blockClass, src, alt }: { blockClass?: string, src: string, alt: string }) => {
  return (
    <div className={blockClass}>
      <Image src={src} alt={alt} className="w-auto h-auto" />
    </div>
  )
};

export default IntroductionImage;
