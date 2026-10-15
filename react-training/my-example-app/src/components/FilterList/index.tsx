import { useMemo, useState } from "react";

const items = ["apple", "banana", "orange", "grape", "kiwi"];

export default function FilterList() {
  const [search, setSearch] = useState("");
  const [newItem, setNewItem] = useState("");
  const [listItems, setListItems] = useState(items);
  const searchItems = useMemo(() => {
    return listItems.filter((item) => item.toLowerCase().includes(search.toLowerCase()));
  }, [search, listItems]);

  return (
    <div>
      <h2>Filter List</h2>
      <input type="text" placeholder="Search fruit" onChange={(e) => setSearch(e.target.value)} />
      <br />
      <input type="text" placeholder="Add fruit" value={newItem} onChange={(e) => setNewItem(e.target.value)} />
      <button onClick={() => setListItems([...listItems, newItem])}>Add item</button>
      <ul>
        {searchItems.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
