import SearchBarInterface from "../../../interfaces/searchBar";

const SearchBar = ({
  filterText, 
  inStockOnly,
  onFilterTextChange,
  onInStockOnlyChange
}: SearchBarInterface) => {
  return (
    <form>
      <input 
        type="text" 
        placeholder="Search..." 
        value={filterText} 
        onChange={(e) => onFilterTextChange(e.target.value)} />
      <label>
        <input 
          type="checkbox" 
          checked={inStockOnly} 
          onChange={(e) => onInStockOnlyChange(e.target.checked)} />
        <span>Only show products in stock</span>
      </label>
    </form>
  );
}

export default SearchBar;