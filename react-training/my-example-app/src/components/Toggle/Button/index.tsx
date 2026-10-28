import React from "react";

type ButtonProps = {
  onToggle: () => void;
  isOn: boolean;
};

const Button = React.memo(function Button({ onToggle, isOn }: ButtonProps) {
  console.log("check re-render");
  return <button onClick={onToggle}>Click to {isOn ? "OFF" : "ON"}</button>;
});

export default Button;
