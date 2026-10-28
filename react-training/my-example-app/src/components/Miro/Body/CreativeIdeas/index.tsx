import BuiltSection from "../BuiltSection"

import bannerImage from "../../assets/banner.png";

const tags = [
  { id: 1, title: "Brainstorming", isActive: true, description: "Unleash creative ideas and build on them with the help of sticky notes, images, mind maps, videos, drawing capabilities — the list goes on.", learnMoreUrl: "#", bannerImage: bannerImage },
  { id: 2, title: "Diagramming", isActive: false, description: " (Diagramming) Unleash creative ideas and build on them with the help of sticky notes, images, mind maps, videos, drawing capabilities — the list goes on.", learnMoreUrl: "#", bannerImage: bannerImage },
  { id: 3, title: "Meetings & Workshops", isActive: false, description: " (Meetings & Workshops) Unleash creative ideas and build on them with the help of sticky notes, images, mind maps, videos, drawing capabilities — the list goes on.", learnMoreUrl: "#", bannerImage: bannerImage },
  { id: 4, title: "Scrum Events", isActive: false, description: " (Scrum Events) Unleash creative ideas and build on them with the help of sticky notes, images, mind maps, videos, drawing capabilities — the list goes on.", learnMoreUrl: "#", bannerImage: bannerImage },
  { id: 5, title: "Mapping", isActive: false, description: " (Mapping) Unleash creative ideas and build on them with the help of sticky notes, images, mind maps, videos, drawing capabilities — the list goes on.", learnMoreUrl: "#", bannerImage: bannerImage },
  { id: 6, title: "Research & Design", isActive: false, description: " (Research & Design) Unleash creative ideas and build on them with the help of sticky notes, images, mind maps, videos, drawing capabilities — the list goes on.", learnMoreUrl: "#", bannerImage: bannerImage },
  { id: 7, title: "Strategic Planning", isActive: false, description: " (Strategic Planning) Unleash creative ideas and build on them with the help of sticky notes, images, mind maps, videos, drawing capabilities — the list goes on.", learnMoreUrl: "#", bannerImage: bannerImage },
]

const CreativeIdeas = () => {
  return (
    <BuiltSection
      tags={tags}
      title={"Built for the way you work"}
    />
  );
}


export default CreativeIdeas;
