import LearnMore from "../../../Common/learnMore"

const IntroductionContent = (
  {
    title,
    description,
    link,
    blockClass,
    titleClass
  }:
  {
    title: string,
    description: string,
    link: string,
    blockClass: string,
    titleClass?: string
  }) => {
  return (
    <div className={`text-left ${blockClass}`}>
      <h2 className={`text-5xl leading-14 font-bold mb-3 ${titleClass}`}>{title}</h2>
      <p className="font-light text-lg mb-6">{description}</p>
      <LearnMore link={link} />
    </div>
  )
}

export default IntroductionContent
