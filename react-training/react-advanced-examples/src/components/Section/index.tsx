import { useContext } from "react"
import { LevelContext } from "../LevelContext"

const Section = ({children}: {children: React.ReactNode}) => {
  const level = useContext(LevelContext);
  return (
    <section>
      <LevelContext value={level + 1}>
        {children}
      </LevelContext>
    </section>
  )
}

export default Section
