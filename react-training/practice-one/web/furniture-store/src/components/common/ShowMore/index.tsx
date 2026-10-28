import Button from '../Button';
const ShowMore = ({
  onClick,
  disabled = false,
}: {
  onClick: () => void;
  disabled?: boolean;
}) => {
  return (
    <div className="mt-6 flex justify-center">
      <Button
        variant="ghost"
        onClick={onClick}
        disabled={disabled}
        className="rounded-full border-1 border-black w-42 text-sm font-medium text-black transition hover:bg-gray-300"
      >
        Show More
      </Button>
    </div>
  );
};

export default ShowMore;
