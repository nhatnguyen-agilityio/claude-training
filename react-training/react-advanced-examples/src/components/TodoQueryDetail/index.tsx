import { useQuery } from "@tanstack/react-query"

interface FetchTodoDetailParams {
  queryKey: [string, number];
}

const fetchTodoDetail = async ({ queryKey }: FetchTodoDetailParams) => {
  const [_key, todoId] = queryKey;
  const res = await fetch(`https://683417dd464b499636014699.mockapi.io/api/v1/tasks/${todoId}`);
  if (!res.ok) {
    throw new Error('Network response was not ok');
  }
  return res.json();
}

const TodoQueryDetail = ({ todoId }: { todoId: number }) => {
  console.log('TodoQueryDetail render with todoId:', todoId);
  const {isPending, isError, data, error} = useQuery({
    queryKey: ['todo', todoId],
    queryFn: fetchTodoDetail,
    enabled: !!todoId,
  })

  if (isPending) return <div>Loading...</div>;

  if (isError) return <div>Error: {(error as Error).message}</div>;

  return <div>{data.title}</div>
}

export default TodoQueryDetail
