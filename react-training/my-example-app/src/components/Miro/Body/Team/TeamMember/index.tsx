import Member from "./Member";

import vmware from "../../../assets/vmware.png";
import docuSign from "../../../assets/docu-sign.png";
import frog from "../../../assets/frog.png"
import mustafa from "../../../assets/mustafa.png";
import jane from "../../../assets/jane.png"
import laura from "../../../assets/laura.png"

const TeamMember = () => {
  return (
    <div className="grid grid-cols-3 gap-x-7 mt-13">
      <Member
        companyImage={vmware}
        profileSrc={mustafa}
        name={"Roxanne Mustafa"}
        description="“When the pandemic hit, those of us who thrive on in-person collaboration were worried that our creativity and productivity would suffer. Miro was the perfect tool to help us with collaboration, whiteboarding, and retrospectives while remote.”"
        profileIntro={"Design Team Lead at VMware"}
      />
      <Member
        companyImage={docuSign}
        profileSrc={jane}
        name={"Jane Ashley"}
        description="“Miro helps solve one of the major gaps in product design: how to manage tasks across product designers whose projects are in different tools.”"
        profileIntro={"Head of Design at DocuSign"}
      />
      <Member
        companyImage={frog}
        profileSrc={laura}
        name={"Laura Baird"}
        description="“As we used Miro we moved from skepticism to belief to innovation, and now we have a tool that’s at the core of what we do and will continue to extend into the future.”"
        profileIntro={"Associate Design Director at frog"}
      />
    </div>
  );
};

export default TeamMember
