// src/components/Button/Button.tsx
import { FC } from 'react';

type ButtonProps = {
  label: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
};

export const Button: FC<ButtonProps> = ({ label, onClick, variant = 'primary' }) => {
  return (
    <button className={`btn ${variant}`} onClick={onClick}>
      {label}
    </button>
  );
};
