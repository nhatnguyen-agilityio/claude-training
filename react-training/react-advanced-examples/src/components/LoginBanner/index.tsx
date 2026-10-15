import Image from "../common/Image"

import loginBanner from '@/assets/login-banner.png'

const LoginBanner = () => {
  return (
    <div className="flex items-end h-full">
      <Image src={loginBanner} alt="Login Banner" />
    </div>
  )
}

export default LoginBanner
