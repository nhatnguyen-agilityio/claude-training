import { useCallback, useState } from "react";
import Button from "./Button";

export default function Toggle() {
  const [isOn, setIsOn] = useState(false);
  const [count, setCount] = useState(0);

  // const handleToggle = () => {
  //   setIsOn(!isOn);
  // };

  const handleToggle = useCallback(() => {
    setIsOn((prev) => !prev);
  }, []);

  return (
    <div>
      <h2>Toggle</h2>
      {/* <button onClick={handleToggle}>{isOn ? "ON" : "OFF"}</button> */}
      <Button onToggle={handleToggle} isOn={isOn} />
      <button onClick={() => setCount(c => c + 1)}>+</button>
      <h3>{count}</h3>
    </div>
  );
}
