const CollaborateBlock = ({ title, description }: { title: string, description: string }) => {
  return (
    <div className="collaborate-block text-left">
      <h2 className="font-bold text-2xl leading-6 mb-5">{title}</h2>
      <p dangerouslySetInnerHTML={{ __html: description }} className="font-light text-lg leading-6" />
    </div>
  );
}

export default CollaborateBlock;
