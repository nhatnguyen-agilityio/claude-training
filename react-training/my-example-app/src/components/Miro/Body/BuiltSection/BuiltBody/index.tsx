import Banner from "./Banner";
import Content from "./Content";

const BuiltBody = ({ tagItem }: { tagItem: {title: string, description: string, bannerImage: string} }) => {
  return (
    <div className="grid grid-cols-5 mt-5">
      <Content title={tagItem.title} description={tagItem.description} />
      <Banner bannerImage={tagItem.bannerImage} />
    </div>
  )
}
export default BuiltBody;
