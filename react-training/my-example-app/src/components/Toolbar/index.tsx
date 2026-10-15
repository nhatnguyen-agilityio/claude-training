import Button from "./Button";

export default function Toolbar() {
  const handleClick = (message: string) => {
    alert(`${message} clicked!`);
  };
  return (
    <div className="toolbar" onClick={() => alert("Toolbar clicked!")}>
      <Button onClick={() => handleClick("Button movie")} text="Movie" />
      <Button onClick={() => handleClick("Button series")} text="Series" />
    </div>
  );
}
