import SignUpBanner from "@/components/SignUpBanner";
import SignUpForm from "@/components/SIgnUpForm";

const SignUp = () => {
  return (
    <div className="2xl:max-w-small-2xl mx-auto h-216 bg-[url(assets/login-background.png)] grid grid-cols-2 items-center">
      <SignUpBanner />
      <SignUpForm />
    </div>
  );
}

export default SignUp
