import { useInfiniteQuery } from "@tanstack/react-query";

const TodoLoadMore = () => {
  const fetchTodo = async ({ pageParam }: { pageParam: number }) => {
    console.log('Fetching page:', pageParam);
    const res = await fetch(`https://683417dd464b499636014699.mockapi.io/api/v1/tasks?page=${pageParam}&limit=5`);
    if (!res.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await res.json();
    return {
      data,
      nextPage: data.length === 5 ? pageParam + 1 : undefined,
    }
  }

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ['todo'],
    queryFn: fetchTodo,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.nextPage;
    },
  })

  if (status === 'pending') return <div>Loading...</div>;

  if (status === 'error') return <div>Error: {(error as Error).message}</div>;

  return (
    <>
      <div>
        <h1>Todo List</h1>
        <ul>
          {data?.pages.map((page, pageIndex) => (
            <div key={pageIndex}>
              {page.data.map((todo: { id: string; title: string }) => (
                <li key={todo.id}>{todo.title}</li>
              ))}
            </div>
          ))}
        </ul>
      </div>
      <div>
        <button
          className="border-2 p-2 mt-2 bg-amber-200 hover:bg-amber-500"
          onClick={() => fetchNextPage()}
          disabled={!hasNextPage || isFetchingNextPage}
        >
          {isFetchingNextPage
            ? 'Loading more...'
            : hasNextPage
              ? 'Load More'
              : 'Nothing more to load'}
        </button>
      </div>
      <div>{isFetching && !isFetchingNextPage ? 'Background Updating...' : null}</div>
    </>
  );
};

export default TodoLoadMore;
