import IntroductionContent from "../Introduction/IntroductionContent";
import IntroductionImage from "../Introduction/IntroductionImage";

import hybridWorkImage from "../../assets/hybrid-work.png";

const WorkTogether = () => {
  return (
    <div className="my-18">
      <div className="container grid grid-cols-2">
        <IntroductionContent
          title={"Work together, wherever you work"}
          description={"In the office, remote, or a mix of the two, with Miro, your team can connect, collaborate, and co-create in one space no matter where you are."}
          link={"#"}
          blockClass={"mr-15 flex flex-col justify-center"}
        />
        <IntroductionImage
          blockClass={"h-full flex justify-end"}
          src={hybridWorkImage}
          alt={"Hybrid Work"}
        />
      </div>
    </div>
  )
}

export default WorkTogether;
