import Image from "../../../../../Common/image"
import starIcon from "../../../../../assets/star.png"

const Star = () => {
  return (
    <div className="w-2/5">
      <Image src={starIcon} alt="Star" className="w-auto h-auto" />
      <p className="text-xs">Based on 5149+ reviews:</p>
    </div>
  );
}

export default Star;
