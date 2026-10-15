import { memo } from "react";

type InputProps = {
  label?: string;
  type: string;
  value: string;
  placeholder: string;
  className?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  ref?: React.Ref<HTMLInputElement>;
};

const Input = memo((props: InputProps) => {
  const { type, value, placeholder, className, onChange, ref } = props;
  return (
    <input ref={ref} className={className} type={type} value={value} placeholder={placeholder} onChange={onChange} />
  );
});

export default Input;
