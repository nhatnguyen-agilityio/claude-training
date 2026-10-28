import { useMutation, useQueryClient } from '@tanstack/react-query';
import { API_ENDPOINT } from '../constants/env-variables';
import { API_ROUTES } from '../constants/api-routers';
import type { PaymentInterface } from '../interfaces/payment';
import { QUERY_KEY } from '../constants/query-keys';

const putPayment = async (
  paymentId: string | number,
  paymentPayload: PaymentInterface,
) => {
  const url = new URL(`${API_ENDPOINT}${API_ROUTES.PAYMENTS}${paymentId}`);
  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(paymentPayload),
  });

  if (!res.ok) {
    let message = 'Failed to update payment information';
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

export const useUpdatePayment = () => {
  const queryClient = useQueryClient();

  const { mutate, mutateAsync, isPending, error, ...rest } = useMutation<
    PaymentInterface,
    Error,
    { paymentId: number | string; paymentPayload: PaymentInterface }
  >({
    mutationFn: ({ paymentId, paymentPayload }) =>
      putPayment(paymentId, paymentPayload),
    onSuccess: (_, variables) => {
      queryClient.setQueryData(
        QUERY_KEY.PAYMENT_DETAIL(String(variables.paymentId)),
        variables.paymentPayload,
      );
      queryClient.invalidateQueries({
        queryKey: QUERY_KEY.PAYMENT(Number(variables.paymentPayload.userId)),
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
