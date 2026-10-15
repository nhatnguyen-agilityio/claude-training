import { useState } from "react";
import Count from "./Count";
import Button from "./Button";

export default function CountInformation() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h2>Count Information</h2>
      <Button onClick={() => setCount(count + 1)}>Increment</Button>
      <Button onClick={() => setCount(count - 1)}>Decrement</Button>
      <Count count={count} />
    </div>
  )
}
