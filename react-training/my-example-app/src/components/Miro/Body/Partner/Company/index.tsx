import Image from "../../../Common/image";

const Company = ({ img }: { img: string }) => {
  return (
    <div className="mt-4 h-16 flex justify-center hover:bg-gray-300">
      <Image src={img} alt="Company" className="w-auto h-auto" />
    </div>
  );
}
export default Company;
