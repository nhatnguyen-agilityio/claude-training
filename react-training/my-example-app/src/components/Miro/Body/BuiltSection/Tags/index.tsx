import { memo } from "react";
import Button from "../../../Common/button";

const Tags = ({ tags, onClick }: { tags: { id: number, title: string, isActive: boolean }[], onClick: (tagId: number) => void}) => {

  return (
    <div className="grid grid-flow-col gap-x-4 mt-6">
      {tags.map((tag) => (
        <Button
          key={tag.id}
          text={tag.title}
          className={`${tag.isActive ? "bg-primary-100 text-white hover:bg-primary-100 active::text-white active:bg-primary-100 hover:text-white" : "bg-white text-primary-100"} rounded-3xl font-light border border-[#F2F2F2] px-4 py-2 hover:bg-gray-200 active:bg-gray-300`}
          onClick={() => onClick(tag.id)}
        />
      ))}
    </div>
  );
}

export default memo(Tags);
