import { useEffect, useState, type SetStateAction } from "react";
import Search from "./Search";

const getUser = () => {
  return Promise.resolve({ id: '1', name: 'Robin' });
};

const User = () => {
  const [search, setSearch] = useState('');
  const [user, setUser] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      const user = await getUser();
      setUser(user);
    };

    loadUser();
  }, []);

  function handleChange(event: { target: { value: SetStateAction<string>; }; }) {
    setSearch(event.target.value);
  }

  return (
    <div>
      {user ? <p>Signed in as {user.name}</p> : null}

      <input type="text" value={search} onChange={handleChange} />

      <p>Searches for {search ? search : '...'}</p>

      <Search value={search} onChange={handleChange}>
        Search:
      </Search>
    </div>
  );
}

export default User;
