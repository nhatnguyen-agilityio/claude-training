import { Loader2 } from 'lucide-react';

const Loading = () => {
  return (
    <div className="flex items-center justify-center w-full h-screen bg-white">
      <Loader2 className="h-10 w-10 animate-spin text-app-primary" />
      <span className="ml-3 text-lg font-medium text-app-primary">
        Loading...
      </span>
    </div>
  );
};

export default Loading;
