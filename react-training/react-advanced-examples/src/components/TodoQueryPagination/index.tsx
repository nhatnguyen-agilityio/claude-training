import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useState } from "react";

const fetchTodo = (page: number) => async () => {
  const res = await fetch(`https://683417dd464b499636014699.mockapi.io/api/v1/tasks?page=${page}&limit=5`);
  if (!res.ok) {
    throw new Error('Network response was not ok');
  }
  return res.json();
}

const TodoQueryPagination = () => {
  const [page, setPage] = useState(1);

  const {isPending, isError, data, error, isPlaceholderData} = useQuery({
    queryKey: ['todo', page],
    queryFn: fetchTodo(page),
    placeholderData: keepPreviousData,
  })

  if (isPending) return <div>Loading...</div>;

  if (isError) return <div>Error: {(error as Error).message}</div>;


  return (
    <>
      <div>
        <h1>Todo List</h1>
        <ul>
          {data.map((todo: { id: number; title: string }) => (
            <li key={todo.id}>{todo.title}</li>
          ))}
        </ul>
      </div>
      <p>Current page: {page}</p>
      <button className="border-2 p-2 mt-2 bg-amber-200 hover:bg-amber-500" onClick={() => setPage(page + 1)} >Next page</button>
    </>
  );
}

export default TodoQueryPagination;
