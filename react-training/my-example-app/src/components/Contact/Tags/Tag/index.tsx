import './index.css';

type TagData = {
  tag: string;
  isActive: boolean;
  onTagClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

export default function Tag({ tag, isActive, onTagClick }: TagData) {

  return (
    <button name={tag} className={`w-[190px] text-[20px] rounded-[8px] tag-btn ${isActive && 'tag-btn-active'}`} onClick={onTagClick}>
      {tag}
    </button>
  );
}
