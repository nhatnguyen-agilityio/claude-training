import Tag from "./Tag";
import "./index.css";
import tags from "../../../mock/tags";
import { useState } from "react";

type TagsProps = {
  onSelectTag: (tag: string) => void;
};

export default function Tags({ onSelectTag }: TagsProps) {
  const [tagsData, setTags] = useState<TagType[]>(tags);

  interface TagType {
    id: number;
    tag: string;
    isActive: boolean;
  }

  const handleTagClick = (tagId: number) => {
    setTags(prevTags =>
      prevTags.map(tag => ({
        ...tag,
        isActive: tag.id === tagId,
      })))
  }

  return (
    <div className="flex flex-wrap tags">
      {tagsData.map((tag, index) => (
        <Tag key={index} tag={tag.tag} isActive={tag.isActive} onTagClick={e => {
          e.preventDefault();
          handleTagClick(tag.id);
          onSelectTag(tag.tag);
        }} />
      ))}
    </div>
  );
}
