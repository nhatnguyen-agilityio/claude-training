import { useMutation } from '@tanstack/react-query';
import type { LoginInterface } from '../interfaces/login';
import { API_ENDPOINT } from '../constants/env-variables';
import { API_ROUTES } from '../constants/api-routers';
import type { UserInterface } from '../interfaces/user';

const postLogin = async (loginPayload: LoginInterface) => {
  const url = new URL(`${API_ENDPOINT}${API_ROUTES.LOGIN}`);
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(loginPayload),
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

export const useLogin = () => {
  const { mutate, mutateAsync, isPending, error, ...rest } = useMutation<
    UserInterface,
    Error,
    LoginInterface
  >({
    mutationFn: (loginPayload) => postLogin(loginPayload),
  });

  return {
    mutate,
    mutateAsync,
    ...rest,
    isLoading: isPending,
    error: error?.message || '',
  };
};
