import Image from "../../../../../Common/image"

const Icon = ({ icon }: { icon: string }) => {
  return (
    <div className="mx-1">
      <Image
        src={icon}
        alt="Google"
        className="h-auto w-auto"
      />
    </div>
  );
}

export default Icon;
