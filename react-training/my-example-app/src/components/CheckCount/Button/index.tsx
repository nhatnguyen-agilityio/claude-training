import { ReactNode } from "react";

export default function Button({ children, onClick }: { children: ReactNode; onClick?: () => void }) {
  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
}
