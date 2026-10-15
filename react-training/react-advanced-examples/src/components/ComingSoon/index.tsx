import Image from "../common/Image"
import comingSoonImage from "@/assets/people-working.png"

const ComingSoon = () => {
  return (
    <div className="grid grid-cols-2 gap-10 min-h-180 items-center">
      <div className="flex flex-col justify-center">
        <p className="mb-8">----------------------------------------</p>
        <h3 className="text-4xl mb-8 font-bold">Coming Soon!</h3>
        <p className="text-2xl">We are currently working on this feature and will launch soon!</p>
        <p className="mt-8">----------------------------------------</p>
      </div>
      <div>
        <Image src={comingSoonImage} alt="Coming soon" />
      </div>
    </div>
  )
}

export default ComingSoon
