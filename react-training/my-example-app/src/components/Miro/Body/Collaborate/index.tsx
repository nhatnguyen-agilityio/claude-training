import Button from "../../Common/button";
import CollaborateBlock from "./CollaborateBlock";

const CollaborateBlockContents = [
  { id: 1, title: "Free forever", description: "Our free plan gives you unlimited team members, 3 boards, and 300+ expert-made templates. Signing up with your work email lets you bring in your team faster. See our <span class='text-blue-500!'><a href=#>pricing plans</a></span> for more features."},
  { id: 2, title: "Easy integrations", description: "Miro has 100+ powerful integrations with tools you already use like G Suite, Slack, and Jira, so your workflow is seamless. View the full list in our <span class='text-blue-500'><a href=#>Marketplace.</a></span>" },
  { id: 3, title: "Security first", description: "We treat your data like you would — with the utmost care. We follow industry-leading security standards and give you tools to protect intellectual property. Learn more at <span class='text-blue-500'><a href=#>our Trust Center .</a></span>" }
];

const Collaborate = () => {
  return (
    <div className="pt-4">
      <div className="container flex flex-col items-center">
        <h2 className="text-5xl w-113 leading-14 font-bold text-center">Collaborate without constraints</h2>
        <div className="grid grid-cols-3 gap-x-15 mx-auto mt-8">
          {CollaborateBlockContents.map((item) => (
            <CollaborateBlock key={item.id} title={item.title} description={item.description} />
          ))}
        </div>
        <Button
          text={"Sign up free"}
          className={"mt-8 text-lg font-normal h-12 w-45 rounded-4xl bg-button-100 hover:bg-blue-700 text-white py-2 px-4"}
          onClick={() => alert("This feature will be available soon!")}
        />
      </div>
    </div>
  );
}

export default Collaborate;
