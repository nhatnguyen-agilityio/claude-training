import { useMutation, useQueryClient } from '@tanstack/react-query';
import { API_ENDPOINT } from '../constants/env-variables';
import { API_ROUTES } from '../constants/api-routers';
import type { PaymentInterface } from '../interfaces/payment';
import { QUERY_KEY } from '../constants/query-keys';

const postPayment = async (paymentPayload: PaymentInterface) => {
  const url = new URL(`${API_ENDPOINT}${API_ROUTES.PAYMENTS}`);
  const payload = {
    ...paymentPayload,
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
    let message = 'Failed to create payment information';
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

export const useAddPayment = () => {
  const queryClient = useQueryClient();

  const { mutate, mutateAsync, isPending, error, ...rest } = useMutation<
    PaymentInterface,
    Error,
    PaymentInterface
  >({
    mutationFn: (paymentPayload) => postPayment(paymentPayload),
    onSuccess: (_, variables) => {
      if (variables.userId) {
        queryClient.invalidateQueries({
          queryKey: QUERY_KEY.PAYMENT(variables.userId),
        });
      }
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
