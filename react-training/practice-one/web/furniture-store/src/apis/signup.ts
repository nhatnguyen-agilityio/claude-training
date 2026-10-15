import { useMutation } from '@tanstack/react-query';
import { API_ENDPOINT } from '../constants/env-variables';
import { API_ROUTES } from '../constants/api-routers';
import type { SignUpInterface } from '../interfaces/signup';

const postSignUp = async (signUpPayload: SignUpInterface) => {
  const url = new URL(`${API_ENDPOINT}${API_ROUTES.SIGN_UP}`);
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(signUpPayload),
  });

  if (!res.ok) {
    let message = 'Failed to create user';
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

export const useSignUp = () => {
  const { mutate, mutateAsync, isPending, error, ...rest } = useMutation<
    string,
    Error,
    SignUpInterface
  >({
    mutationFn: (signUpPayload) => postSignUp(signUpPayload),
  });

  return {
    mutate,
    mutateAsync,
    ...rest,
    isLoading: isPending,
    error: error?.message || '',
  };
};
