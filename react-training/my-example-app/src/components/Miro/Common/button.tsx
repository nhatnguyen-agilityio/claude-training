import { memo } from "react";

const Button = memo(({ text, className, onClick }: { text: string, className?: string, onClick?: () => void }) => {
  return (
    <button onClick={onClick} className={className}>
      {text}
    </button>
  );
});

export default Button;
