import Button from "../../Common/button";
import Title from "../../Common/title";

const JoinUs = () => {
  const handleClick = () => {
    alert("This feature will be available soon!");
  }

  return (
    <div className="mb-5 text-white mx-auto mt-13 h-112">
      <div className="container flex flex-col justify-center items-center h-full bg-primary-100">
        <Title title={"Join 45M+ users today"} className="text-white leading-14 text-5xl" />
        <p className="opacity-60 mb-4 mt-2">Start for free — upgrade anytime.</p>
        <a className="opacity-60 underline hover:text-blue-200" href="#">Joining as an organization? Contact Sales</a>
        <Button text="Sign up for free →" onClick={handleClick} className="mt-9 mb-1 h-13 text-lg font-normal rounded-4xl bg-button-100 hover:bg-blue-700 text-white py-2 px-7" />
      </div>
    </div>
  )
};

export default JoinUs;
