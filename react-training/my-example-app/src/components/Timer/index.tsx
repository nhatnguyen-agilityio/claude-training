import { useRef, useState } from "react";

export default function Timer() {
  const [time, setTime] = useState(0);
  const timeRef = useRef<number | null>(null);

  const handleStart = () => {
    if (!timeRef.current) {
      timeRef.current = window.setInterval(() => {
        setTime((prevTime) => prevTime + 10);
      }, 10);
    }
    else {
      setTime(0);
    }
  }

  const handleStop = () => {
    if (timeRef.current) {
      window.clearInterval(timeRef.current);
      timeRef.current = null;
    }
  }

  return (
    <div>
      <h2>Timer: {time / 1000}s</h2>
      <button onClick={handleStart}>Start</button>
      <button onClick={handleStop}>Stop</button>
    </div>
  );
}
