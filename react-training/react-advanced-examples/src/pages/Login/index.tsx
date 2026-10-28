import LoginBanner from "@/components/LoginBanner";
import LoginForm from "@/components/LoginForm";
import ThirdPartyLogin from "@/components/ThirdPartyLogin";

const Login = () => {
  return (
    <div className="2xl:max-w-small-2xl mx-auto h-216 bg-[url(assets/login-background.png)] grid grid-cols-2 items-center">
      <div className="flex flex-col pl-5">
        <LoginForm />
        <ThirdPartyLogin />
      </div>
      <LoginBanner />
    </div>
  );
};

export default Login;
