import AboutItem from "./AboutItem";

const aboutItems = [
  {
    id: 1,
    title: "ISO",
    description: "ISO-27001 enterprise-grade security compliant",
  },
  {
    id: 2,
    title: "#1",
    description: "Visual Collaboration Platform on G2",
  },
  {
    id: 3,
    title: "99%",
    description: "of the Fortune 100 are customers",
  },
  {
    id: 4,
    title: "1,000+",
    description: "community- and expert-built templates",
  },
  {
    id: 5,
    title: "45M+",
    description: "users around the world",
  },
  {
    id: 6,
    title: "100+",
    description: "integrations with technology partners",
  }
]

const About = () => {
  return (
    <div className="mt-13 h-full grid grid-cols-3 gap-x-3">
      {aboutItems.map((item) => (
        <AboutItem key={item.id} title={item.title} description={item.description} />
      ))}
    </div>
  );
};

export default About;
