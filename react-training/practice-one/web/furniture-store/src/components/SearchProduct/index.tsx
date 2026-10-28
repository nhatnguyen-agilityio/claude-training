import { Search } from 'lucide-react';
import { Input } from '../ui/input';
import { memo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const SearchProduct = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const [searchInput, setSearchInput] = useState(searchQuery);

  const handleSearch = () => {
    const newParams = new URLSearchParams(searchParams);
    if (searchInput) {
      newParams.set('search', searchInput);
    } else {
      newParams.delete('search');
    }
    // Reset pagination when searching
    newParams.delete('topProductsPage');
    setSearchParams(newParams);
  };

  return (
    <div className="mt-6 mb-4 w-full relative flex justify-between mx-auto lg:w-160">
      <Input
        type="text"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        placeholder="Search by name or category..."
        className="rounded-3xl h-14 shadow-none placeholder:font-light pl-5 pr-14 text-base focus:border-none"
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            handleSearch();
          }
        }}
      />
      <button
        type="button"
        onClick={handleSearch}
        className="absolute right-0 top-1/2 -translate-y-1/2 rounded-r-3xl border-l-1 border-l-background-primary h-full w-16 flex items-center justify-center hover:bg-background-primary"
      >
        <Search className="text-gray-400 h-5 w-full" aria-label="Search" />
      </button>
    </div>
  );
};

export default memo(SearchProduct);
