import { useState } from "react";
import Panel from "./Panel";

export default function Accordion() {
  const [activePanel, setActivePanel] = useState<number>(0);

  return (
    <>
      <h1>Accordion</h1>
      <Panel title="Accordion 1" description="This is the description for Accordion 1" isActive={activePanel === 1} onChange={() => activePanel === 1 ? setActivePanel(0) : setActivePanel(1)} />
      <Panel title="Accordion 2" description="This is the description for Accordion 2" isActive={activePanel === 2} onChange={() => activePanel === 2 ? setActivePanel(0) : setActivePanel(2)} />
    </>
  )
};
