import { useMutation, useQueryClient } from "@tanstack/react-query";

const TodoMutations = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (newTodo: {
      title: string,
      createdAt: string,
      priority: string,
      description: string,
      image?: string
    }) => {
      const res = await fetch('https://683417dd464b499636014699.mockapi.io/api/v1/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTodo),
      });
      if (!res.ok) {
        throw new Error('Network response was not ok');
      }
      return res.json();
    },
    onSuccess: (data) => {
      console.log('Todo added successfully:', data);
      queryClient.invalidateQueries({ queryKey: ['todo'] });
    },
    onError: (error) => {
      console.error('Error adding todo:', error);
    },
    onSettled: () => {
      console.log('Mutation settled');
    },
  });

  return (
    <div>
      {mutation.isPending ? (
        <div>Adding todo...</div>
      ) : (
        <>
          {mutation.isError ? (
            <div>Error: {(mutation.error as Error).message}</div>
          ) : null}

          {mutation.isSuccess ? (
            <div>Todo added! ID: {mutation.data.id}</div>
          ) : null}

          <button
            className="border-2 p-2 mt-2 bg-amber-200 hover:bg-amber-500"
            onClick={() =>
              mutation.mutate({
                title: 'New Task1',
                createdAt: new Date().toISOString(),
                priority: 'High',
                description: 'This is a new task added via mutation',
              })
            }
          >
            Add Todo
          </button>
        </>
      )}
    </div>
  );
};

export default TodoMutations;
