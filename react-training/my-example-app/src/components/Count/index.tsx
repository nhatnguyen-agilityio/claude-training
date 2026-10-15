import { useCallback, useState } from "react";
import CountChild from "./CountChild";

export default function Count() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState("");

  const handleClick = useCallback(() => {
    console.log(name);
    setName("");
  }, [name]);

  return (
    <div>
      <h1>Count {count}</h1>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
      <CountChild onClick={handleClick} name={name} />
    </div>
  );
}
