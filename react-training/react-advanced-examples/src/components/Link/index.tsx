import { useState } from "react";

const STATUS = {
  HOVERED: 'hovered',
  NORMAL: 'normal',
}

const Link = ({ page, children }: { page: string, children: React.ReactNode}) => {
  const [status, setStatus] = useState(STATUS.NORMAL);

  const onMouseEnter = () => {
    setStatus(STATUS.HOVERED);
  }
  const onMouseLeave = () => {
    setStatus(STATUS.NORMAL);
  }

  return (
    <a href={page || '#'} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} className={status}>
      {children}
    </a>
  );
}

export default Link;
