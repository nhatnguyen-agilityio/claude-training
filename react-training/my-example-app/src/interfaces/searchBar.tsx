interface SearchBarInterface {
    filterText: string;
    inStockOnly: boolean;
    onFilterTextChange: (filterText: string) => void;
    onInStockOnlyChange: (inStockOnly: boolean) => void;
}

export default SearchBarInterface;