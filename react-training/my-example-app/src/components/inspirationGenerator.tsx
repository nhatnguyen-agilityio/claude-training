import { useState } from "react";
import FancyText from "./fancyText";
import inspirations from "../mock/inspirations";
import Color from "./color";

export default function InspirationGenerator({ children }: Readonly<{ children: React.ReactNode }>) {
    const [index, setIndex] = useState(0);
    const inspiration = inspirations[index]
    const next = () => setIndex((index + 1) % inspirations.length);

    return (
        <>
            <p>Your inspiration {inspiration.type} is:</p>
            {inspiration.type === 'quote' ? <FancyText text={inspiration.value} /> : <Color color={inspiration.value} />}
            <button onClick={next}>Inspire me again</button>
            {children}
        </>
    );
}
