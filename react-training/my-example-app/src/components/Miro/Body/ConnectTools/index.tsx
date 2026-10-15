import IntroductionContent from "../Introduction/IntroductionContent";
import IntroductionImage from "../Introduction/IntroductionImage";

import tools from "../../assets/tools.png"

const ConnectTools = () => {
  return (
    <div className="my-18">
      <div className="container grid grid-cols-2 justify-between">
        <IntroductionImage
          src={tools}
          alt={"Connect your tools"}
        />
        <IntroductionContent
          title={"Connect your tools, close your tabs"}
          description={"Whether you want to edit your Google Docs, resolve Jira issues, or collaborate over Zoom, Miro has 100+ integrations with tools you already use and love."}
          link={"#"}
          blockClass={"ml-15 flex flex-col justify-center"}
          titleClass={"w-89 pr-3 text-wrap"}
        />
      </div>
    </div>
  );
}

export default ConnectTools;
