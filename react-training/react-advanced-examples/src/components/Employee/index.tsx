import { useEffect, useState } from "react";

type EmployeeProps = {
  id: string;
};

const Employee = ({ id }: EmployeeProps) => {
  const [user, setUser] = useState<{ name: string; age: number; address: string } | null>(null);

  const fetchUserData = async (id: string) => {
    const response = await fetch("/" + id)
    setUser(await response.json());
  }

  useEffect(() => {
    fetchUserData(id);
  }, [id]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <details>
      <summary>{user.name}</summary>
      <strong>{user.age}</strong>
      <br />
      lives in {user.address}
    </details>
  );
}

export default Employee;
