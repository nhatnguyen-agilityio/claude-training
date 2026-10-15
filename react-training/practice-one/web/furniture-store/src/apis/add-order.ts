import { useMutation } from '@tanstack/react-query';
import { API_ENDPOINT } from '../constants/env-variables';
import { API_ROUTES } from '../constants/api-routers';
import type { OrderInterface } from '../interfaces/order';

const postOrder = async (orderPayload: OrderInterface) => {
  const url = new URL(`${API_ENDPOINT}${API_ROUTES.ORDERS}`);
  const payload = {
    ...orderPayload,
    orderDate: new Date().toISOString(),
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

export const useAddOrder = () => {
  const { mutate, mutateAsync, isPending, error, ...rest } = useMutation<
    OrderInterface,
    Error,
    OrderInterface
  >({
    mutationFn: (orderPayload) => postOrder(orderPayload),
  });

  return {
    mutate,
    mutateAsync,
    ...rest,
    isLoading: isPending,
    error: error?.message || '',
  };
};
