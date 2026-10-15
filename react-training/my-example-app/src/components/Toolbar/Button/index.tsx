type ButtonProps = {
  onClick: () => void
  text: string
};

export default function Button({ onClick, text }: ButtonProps) {
  return (
    <button className="toolbar-button" onClick={e => {
      e.stopPropagation();
      onClick();
    }}>
      {text}
    </button>
  );
}
