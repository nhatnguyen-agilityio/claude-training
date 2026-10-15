import { useRef } from "react";

export default function InputFocus() {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFocus = () => {
    inputRef.current?.focus();
  }

  return (
    <div>
      <h2>Input Focus</h2>
      <input type="text" placeholder="Focus me!" ref={inputRef} />
      <button onClick={handleFocus}>Focus input</button>
    </div>
  );
}
