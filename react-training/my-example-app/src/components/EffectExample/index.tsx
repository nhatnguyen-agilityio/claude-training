import { useState } from "react";
import Video from "./Video";

export default function EffectExample() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [text, setText] = useState("");

  return (
    <>
    <input type="text" value={text} onChange={(e) => setText(e.target.value)} />
      <button onClick={() => setIsPlaying(!isPlaying)}>{isPlaying ? "Pause" : "Play"}</button>
      <Video isPlaying={isPlaying} />
    </>
  );
}
