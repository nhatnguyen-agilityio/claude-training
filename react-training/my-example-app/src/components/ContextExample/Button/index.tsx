import { ReactNode, useContext } from 'react';
import { ThemeContext } from '../../ContextExample'; // Adjust the path as needed

export default function Button({ children, onClick }: { children: ReactNode; onClick?: () => void }) {
  const theme = useContext(ThemeContext);
  const className = `btn-${theme}`

  return (
    <button className={className} onClick={onClick}>
      {children}
    </button>
  );
}
