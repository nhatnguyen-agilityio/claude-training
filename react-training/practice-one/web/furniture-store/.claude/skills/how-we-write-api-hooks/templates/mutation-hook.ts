// Template: mutation hook (create / update / delete).
// Replace: RESOURCE, ResourceInterface, postResource, useAddResource,
// the HTTP method, and the query keys invalidated in onSuccess.
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { ResourceInterface } from '../interfaces/resource';
import { API_ENDPOINT } from '../constants/env-variables';
import { API_ROUTES } from '../constants/api-routers';
import { QUERY_KEY } from '../constants/query-keys';

const postResource = async (payload: ResourceInterface) => {
  const url = new URL(`${API_ENDPOINT}${API_ROUTES.RESOURCE}`);
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ...payload, createdAt: new Date().toISOString() }),
  });

  if (!res.ok) {
    let message = 'Failed to save resource';
    try {
      const data = await res.json();
      if (data?.error) message = data.error;
    } catch {
      // body is not JSON, keep the default message
    }
    throw new Error(message);
  }

  return res.json();
};

export const useAddResource = () => {
  const queryClient = useQueryClient();

  const { mutate, mutateAsync, isPending, error, ...rest } = useMutation<
    ResourceInterface,
    Error,
    ResourceInterface
  >({
    mutationFn: (payload) => postResource(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEY.RESOURCE(variables.userId),
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
