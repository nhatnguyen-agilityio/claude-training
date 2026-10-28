const AboutItem = ({ title, description }: { title: string, description: string}) => {
  return (
    <div className="flex flex-col justify-center items-center">
      <h3 className="text-7xl font-bold">{title}</h3>
      <p className="font-light text-lg leading-6">{description}</p>
    </div>
  )
}

export default AboutItem
