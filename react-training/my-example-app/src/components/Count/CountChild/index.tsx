import { memo } from "react";

const CountChild = memo(({ onClick, name }: { onClick: () => void, name: string }) => {
  console.log("CountChild component rendered");
  return (
    <div>
      <h1>Count Child</h1>
      <p>This is a child component of Count.</p>
      <button onClick={onClick}>Reset Name</button>
      <h2>Name: {name}</h2>
    </div>
  );
});

export default CountChild;
