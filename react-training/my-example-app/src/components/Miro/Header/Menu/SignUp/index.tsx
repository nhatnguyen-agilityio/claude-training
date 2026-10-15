import Button from "../../../Common/button";

const SignUp = () => {
  const handleSignUp = () => {
    alert("This feature will be available soon!");
  };

  return (
    <div>
      <Button text={"Sign up free"} className={"bg-button-100 hover:bg-blue-700 text-white py-2 px-4 rounded-2xl"} onClick={handleSignUp} />
    </div>
  );
}

export default SignUp;
