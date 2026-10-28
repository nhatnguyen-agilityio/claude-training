import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { CartInterface } from '../interfaces/cart';
import { API_ENDPOINT } from '../constants/env-variables';
import { API_ROUTES } from '../constants/api-routers';
import { QUERY_KEY } from '../constants/query-keys';

const postCart = async (cartPayload: CartInterface) => {
  const url = new URL(`${API_ENDPOINT}${API_ROUTES.CARTS}add-to-cart`);
  const payload = {
    ...cartPayload,
    createdAt: new Date().toISOString(),
  };
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
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

export const useAddCart = () => {
  const queryClient = useQueryClient();

  const { mutate, mutateAsync, isPending, error, ...rest } = useMutation<
    boolean,
    Error,
    CartInterface
  >({
    mutationFn: (cartPayload) => postCart(cartPayload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEY.USER_CART(variables.userId),
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
