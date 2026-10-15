type InputProps = {
  type: string;
  placeholder: string;
  value: string;
  onChange: (type: string, value: string) => void;
};

export default function Input({ type, placeholder, value, onChange }: InputProps) {
  return (
    <input
      type="text"
      className="bg-[#F7F7F7] rounded-[8px] p-[10px] text-[20px] placeholder:text-[#B1A6C9] text-[#2E0249] border-2 border-[#F7F7F7] focus:outline-none focus:border-[#2E0249] focus:ring-0"
      placeholder={placeholder}
      name={type}
      value={value}
      onChange={(e) => onChange(type, e.target.value)}
    />
  );
}
