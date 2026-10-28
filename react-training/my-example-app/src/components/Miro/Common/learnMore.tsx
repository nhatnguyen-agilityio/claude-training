const LearnMore = ({ link }: {link: string}) => {
  return (
    <a href={link} className="text-blue-500 underline hover:text-blue-800">Learn more</a>
  );
}

export default LearnMore;
