import Heading from "../Heading"
import Section from "../Section"

const Context = () => {
  return (
    <Section>
      <Heading>Heading 1</Heading>
      <Section>
        <Heading>Heading 2</Heading>
        <Heading>Heading 2</Heading>
        <Heading>Heading 2</Heading>
        <Section>
          <Heading>Heading 3</Heading>
          <Heading>Heading 3</Heading>
          <Heading>Heading 3</Heading>
          <Section>
            <Heading>Heading 4</Heading>
            <Heading>Heading 4</Heading>
            <Heading>Heading 4</Heading>
            <Section>
              <Heading>Heading 5</Heading>
              <Heading>Heading 5</Heading>
              <Heading>Heading 5</Heading>
              <Section>
                <Heading>Heading 6</Heading>
                <Heading>Heading 6</Heading>
                <Heading>Heading 6</Heading>
              </Section>
            </Section>
          </Section>
        </Section>
      </Section>
    </Section>
  )
}

export default Context
