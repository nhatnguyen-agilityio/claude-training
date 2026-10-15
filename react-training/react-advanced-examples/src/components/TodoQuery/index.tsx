import {
  useQuery,
} from '@tanstack/react-query';

const fetchTodo = async () => {
  const res = await fetch('https://683417dd464b499636014699.mockapi.io/api/v1/tasks');
  if (!res.ok) {
    throw new Error('Network response was not ok');
  }
  return res.json();
};

const TodoQuery = () => {
  const {isPending, isError, data, error} = useQuery({
    queryKey: ['todo'],
    queryFn: fetchTodo,
  })

  if (isPending) return <div>Loading...</div>;

  if (isError) return <div>Error: {(error as Error).message}</div>;

  return (
    <div>
      <h1>Todo List</h1>
      <ul>
        {data.map((todo: { id: number; title: string }) => (
          <li key={todo.id}>{todo.title}</li>
        ))}
      </ul>
    </div>
  )
}

export default TodoQuery;
