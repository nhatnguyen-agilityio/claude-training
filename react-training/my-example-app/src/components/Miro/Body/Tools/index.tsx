import BuiltSection from "../BuiltSection";

import bannerImage from "../../assets/tool-banner.png"

const tags = [
  { id: 1, title: "UX & Design", isActive: true, description: "(UX & Design) Unleash creative ideas and build on them with the help of sticky notes, images, mind maps, videos, drawing capabilities — the list goes on.", learnMoreUrl: "#", bannerImage: bannerImage },
  { id: 2, title: "Marketing", isActive: false, description: "(Marketing) Unleash creative ideas and build on them with the help of sticky notes, images, mind maps, videos, drawing capabilities — the list goes on.", learnMoreUrl: "#", bannerImage: bannerImage },
  { id: 3, title: "Product Management", isActive: false, description: "(Product Management) Unleash creative ideas and build on them with the help of sticky notes, images, mind maps, videos, drawing capabilities — the list goes on.", learnMoreUrl: "#", bannerImage: bannerImage },
  { id: 4, title: "Engineering", isActive: false, description: "(Engineering) Unleash creative ideas and build on them with the help of sticky notes, images, mind maps, videos, drawing capabilities — the list goes on.", learnMoreUrl: "#", bannerImage: bannerImage },
  { id: 5, title: "Consultants", isActive: false, description: "(Consultants) Unleash creative ideas and build on them with the help of sticky notes, images, mind maps, videos, drawing capabilities — the list goes on.", learnMoreUrl: "#", bannerImage: bannerImage },
  { id: 6, title: "Agile Coaches", isActive: false, description: "(Agile Coaches) Unleash creative ideas and build on them with the help of sticky notes, images, mind maps, videos, drawing capabilities — the list goes on.", learnMoreUrl: "#", bannerImage: bannerImage },
  { id: 7, title: "Sales", isActive: false, description: "(Sales) Unleash creative ideas and build on them with the help of sticky notes, images, mind maps, videos, drawing capabilities — the list goes on.", learnMoreUrl: "#", bannerImage: bannerImage },
]

const Tools = () => {
  return (
    <BuiltSection
      tags={tags}
      title={"Built for all kinds of teams"}
    />
  );
}
export default Tools;
