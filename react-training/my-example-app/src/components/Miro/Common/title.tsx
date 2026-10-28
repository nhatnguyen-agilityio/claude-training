import { memo } from "react";

const Title = memo(({ title, className }: { title: string, className?: string }) => {
  return <h2 className={`text-5xl leading-14 font-bold mt-5 ${className}`}>{title}</h2>;
});
export default Title;
