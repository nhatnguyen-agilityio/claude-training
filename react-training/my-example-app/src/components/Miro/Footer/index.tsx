import Image from "../Common/image"

import iosIcon from "../assets/ios.png"
import androidIcon from "../assets/google-play.png"
import install from "../assets/install.png"

const about = [
  {id: 1, text: "Terms of Service"},
  {id: 2, text: "Privacy Policy"},
  {id: 3, text: "Manage Cookies"},
]

const Footer = () => {
  return (
    <div className="h-38 mt-25 bg-primary-100">
      <div className="2xl:max-w-big-2xl mx-auto flex justify-between items-center h-full">
        <ul className="flex text-white">
          {about.map((item) => (
            <li key={item.id} className="mr-5 font-light underline underline-offset-3 hover:text-blue-200">{item.text}</li>
          ))}
        </ul>
        <div className="flex justify-end pr-13">
          <Image src={iosIcon} alt="Install" className="w-auto h-auto mr-3" />
          <Image src={androidIcon} alt="Install" className="w-auto h-auto mr-3" />
          <Image src={install} alt="Install" className="w-auto h-auto" />
        </div>
      </div>
    </div>
  )
}

export default Footer
