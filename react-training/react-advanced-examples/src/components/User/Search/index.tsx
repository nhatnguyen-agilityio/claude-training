const Search = ({ value, onChange, children }: { value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; children: React.ReactNode; }) => {
  return (
    <div>
      <label htmlFor="search">{children}: {value}</label>
      <input
        id="search"
        type="text"
        value={value}
        onChange={onChange}
      />
    </div>
  );
}

export default Search;
