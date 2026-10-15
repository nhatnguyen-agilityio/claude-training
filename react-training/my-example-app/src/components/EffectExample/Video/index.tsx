import { useEffect, useRef } from "react";

export default function Video({ isPlaying }: { isPlaying: boolean }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (isPlaying) {
      console.log('Playing video')
      videoRef.current?.play()
    }
    else {
      console.log('Pausing video')
      videoRef.current?.pause()
    }
  }, [isPlaying]);

  return (
    <video
      className="w-full h-full rounded-[8px]"
      src="https://www.w3schools.com/html/mov_bbb.mp4"
      controls
      ref={videoRef}
    />
  );
}
