import { useMutation, useQueryClient } from '@tanstack/react-query';
import { API_ENDPOINT } from '../constants/env-variables';
import { API_ROUTES } from '../constants/api-routers';
import { QUERY_KEY } from '../constants/query-keys';

const deleteCart = async (userId: string) => {
  const url = new URL(`${API_ENDPOINT}${API_ROUTES.CARTS}users/${userId}`);
  const res = await fetch(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    let message = 'Failed to login';
    try {
      const data = await res.json();
      if (data?.error) message = data.error;
    } catch {
      // ignore
    }
    throw new Error(message);
  }

  return res.json();
};

export const useDeleteCart = () => {
  const queryClient = useQueryClient();

  const { mutate, mutateAsync, isPending, error, ...rest } = useMutation<
    boolean,
    Error,
    { userId: string }
  >({
    mutationFn: (item) => deleteCart(item.userId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEY.USER_CART(Number(variables.userId)),
      });
    },
  });

  return {
    mutate,
    mutateAsync,
    ...rest,
    isLoading: isPending,
    error: error?.message || '',
  };
};
