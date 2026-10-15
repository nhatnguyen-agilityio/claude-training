import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { CartInterface } from '../interfaces/cart';
import { API_ENDPOINT } from '../constants/env-variables';
import { API_ROUTES } from '../constants/api-routers';
import { QUERY_KEY } from '../constants/query-keys';

const updateCart = async (
  cartId: number | string,
  cartPayload: CartInterface,
) => {
  const url = new URL(`${API_ENDPOINT}${API_ROUTES.CARTS}${cartId}`);

  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(cartPayload),
  });

  if (!res.ok) {
    let message = 'Failed to update cart';
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

export const useUpdateCart = () => {
  const queryClient = useQueryClient();

  const { mutate, mutateAsync, isPending, error, ...rest } = useMutation<
    boolean,
    Error,
    { cartId: number | string; cartPayload: CartInterface }
  >({
    mutationFn: ({ cartId, cartPayload }) => updateCart(cartId, cartPayload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEY.USER_CART(variables.cartPayload.userId),
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
