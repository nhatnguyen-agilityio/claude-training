import { memo } from "react";

const Image = ({ src, alt, width = undefined, height = undefined, className = "" }: { src: string, alt: string, width?: number, height?: number, className?: string }) => {
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
    />
  );
}

export default memo(Image)
