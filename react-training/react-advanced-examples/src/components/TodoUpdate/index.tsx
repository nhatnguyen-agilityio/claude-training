import { useMutation, useQueryClient } from "@tanstack/react-query";

const TodoUpdate = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (updatedTodo: {
      id: number,
      title?: string,
      createdAt?: string,
      priority?: string,
      description?: string,
      image?: string
    }) => {
      const res = await fetch(`https://683417dd464b499636014699.mockapi.io/api/v1/tasks/${updatedTodo.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTodo),
      });
      if (!res.ok) {
        throw new Error('Network response was not ok');
      }
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['todo', Number(data.id)], data);
      queryClient.invalidateQueries({ queryKey: ['todo'] });
    },
    onError: (error) => {
      console.error('Error updating todo:', error);
    },
    onSettled: () => {
      console.log('Mutation settled');
    },
  });

  return (
    <div>
      {mutation.isPending ? (
        <div>Updating todo...</div>
      ) : (
        <>
          {mutation.isError ? (
            <div>Error: {(mutation.error as Error).message}</div>
          ) : null}

          {mutation.isSuccess ? (
            <div>Todo updated! ID: {mutation.data.id}</div>
          ) : null}

          <button
            className="border-2 p-2 mt-2 bg-amber-200 hover:bg-amber-500"
            onClick={() =>
              mutation.mutate({
                id: 24,
                title: 'Updated Task Title - 24',
                priority: 'Low',
              })
            }
          >
            Update Todo with ID 1
          </button>
        </>
      )}
    </div>
  );
};

export default TodoUpdate;
