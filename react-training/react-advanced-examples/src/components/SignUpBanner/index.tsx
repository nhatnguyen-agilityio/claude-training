import signUpBanner from "@/assets/sign-up-banner.png";
import Image from "../common/Image";

const SignUpBanner = () => {
  return (
    <div className="h-full flex items-end">
      <div className="h-3/4">
        <Image src={signUpBanner} className="h-full" alt="Sign Up Banner" />
      </div>
    </div>
  )
}

export default SignUpBanner
