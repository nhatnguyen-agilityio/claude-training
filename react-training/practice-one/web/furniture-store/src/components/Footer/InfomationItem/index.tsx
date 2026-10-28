const InformationItem = ({
  title,
  information,
  className = '',
}: {
  title: string;
  information: string;
  className?: string;
}) => {
  return (
    <div className="flex flex-col mt-7 items-start text-white lg:justify-end lg:mr-6">
      <p className="text-sm font-light opacity-50">{title}</p>
      <p className={`mt-2 ${className}`}>{information}</p>
    </div>
  );
};

export default InformationItem;
