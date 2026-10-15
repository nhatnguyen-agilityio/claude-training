import LearnMore from "../../../../Common/learnMore";

const Content = ({ title, description }: { title: string, description: string }) => {
  return (
    <div className="flex flex-col col-span-2 font-light mt-10">
      <p className="mb-6">{title}</p>
      <p className="mb-6 text-lg pr-8 leading-6">
        {description}
      </p>
      <LearnMore link={"#"} />
    </div>
  );
}

export default Content;
