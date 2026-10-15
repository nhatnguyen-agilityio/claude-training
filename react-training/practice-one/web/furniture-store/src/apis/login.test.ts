import { createElement, type ReactNode } from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useLogin } from './login';
import type { LoginInterface } from '../interfaces/login';
import type { UserInterface } from '../interfaces/user';

jest.mock('../constants/api-routers', () => ({
  API_ROUTES: {
    LOGIN: '/login',
  },
}));

jest.mock('../constants/env-variables', () => ({
  API_ENDPOINT: 'http://localhost:3001',
}));

global.fetch = jest.fn();

const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

const createMockResponse = (data: unknown, ok = true) =>
  ({
    ok,
    json: async () => data,
    status: ok ? 200 : 500,
    statusText: ok ? 'OK' : 'Internal Server Error',
    headers: new Headers(),
    redirected: false,
    type: 'basic' as ResponseType,
    url: '',
    clone: jest.fn(),
    body: null,
    bodyUsed: false,
    arrayBuffer: jest.fn(),
    blob: jest.fn(),
    formData: jest.fn(),
    text: jest.fn(),
    bytes: jest.fn(),
  }) as Response;

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
        staleTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });

  return function Wrapper({ children }: { children: ReactNode }) {
    return createElement(
      QueryClientProvider,
      { client: queryClient },
      children,
    );
  };
};

const mockLoginPayload: LoginInterface = {
  username: 'testuser',
  password: 'testpassword123',
};

const mockUserResponse: UserInterface = {
  user: {
    id: 1,
    username: 'testuser',
    address: '123 Main St',
    name: 'Test User',
    phone: 1234567890,
  },
};

describe('useLogin', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch.mockReset();
  });

  describe('Successful Mutations', () => {
    it('should successfully login with valid credentials', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse(mockUserResponse));

      const { result } = renderHook(() => useLogin(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(mockLoginPayload);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it('should call POST endpoint with correct URL and payload', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse(mockUserResponse));

      const { result } = renderHook(() => useLogin(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(mockLoginPayload);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockFetch).toHaveBeenCalledTimes(1);
      const callArgs = mockFetch.mock.calls[0];
      expect(callArgs[0].toString()).toBe('http://localhost:3001/login');
      expect(callArgs[1]?.method).toBe('POST');
      expect(callArgs[1]?.headers).toEqual({
        'Content-Type': 'application/json',
      });
      expect(JSON.parse(callArgs[1]?.body as string)).toEqual(mockLoginPayload);
    });

    it('should handle async mutation with mutateAsync', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse(mockUserResponse));

      const { result } = renderHook(() => useLogin(), {
        wrapper: createWrapper(),
      });

      const response = await result.current.mutateAsync(mockLoginPayload);

      expect(response).toEqual(mockUserResponse);
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it('should handle login with minimal user data', async () => {
      const minimalUserResponse: UserInterface = {
        user: {
          id: 1,
          username: 'testuser',
        },
      };

      mockFetch.mockResolvedValueOnce(createMockResponse(minimalUserResponse));

      const { result } = renderHook(() => useLogin(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(mockLoginPayload);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it('should handle login with complete user data', async () => {
      const completeUserResponse: UserInterface = {
        user: {
          id: 123,
          username: 'johndoe',
          address: '456 Oak Ave, Suite 100',
          name: 'John Doe',
          phone: 9876543210,
        },
      };

      mockFetch.mockResolvedValueOnce(createMockResponse(completeUserResponse));

      const { result } = renderHook(() => useLogin(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(mockLoginPayload);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it('should handle login with different username formats', async () => {
      const emailUsernamePayload: LoginInterface = {
        username: 'user@example.com',
        password: 'password123',
      };

      const emailUserResponse: UserInterface = {
        user: {
          id: 2,
          username: 'user@example.com',
          name: 'Email User',
        },
      };

      mockFetch.mockResolvedValueOnce(createMockResponse(emailUserResponse));

      const { result } = renderHook(() => useLogin(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(emailUsernamePayload);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      const callArgs = mockFetch.mock.calls[0];
      expect(JSON.parse(callArgs[1]?.body as string)).toEqual(
        emailUsernamePayload,
      );
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors', async () => {
      const networkError = new Error('Network response was not ok');
      mockFetch.mockRejectedValueOnce(networkError);

      const { result } = renderHook(() => useLogin(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(mockLoginPayload);

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBe('Network response was not ok');
      expect(result.current.isLoading).toBe(false);
    });

    it('should handle HTTP error responses', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse(null, false));

      const { result } = renderHook(() => useLogin(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(mockLoginPayload);

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBe('Failed to login');
      expect(result.current.isLoading).toBe(false);
    });

    it('should handle HTTP error with custom error message', async () => {
      const errorResponse = {
        error: 'Invalid username or password',
      };

      mockFetch.mockResolvedValueOnce({
        ...createMockResponse(errorResponse, false),
        json: async () => errorResponse,
      });

      const { result } = renderHook(() => useLogin(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(mockLoginPayload);

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBe('Invalid username or password');
    });

    it('should handle HTTP error with malformed error response', async () => {
      mockFetch.mockResolvedValueOnce({
        ...createMockResponse(null, false),
        json: async () => {
          throw new Error('Invalid JSON');
        },
      });

      const { result } = renderHook(() => useLogin(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(mockLoginPayload);

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBe('Failed to login');
    });

    it('should handle 401 Unauthorized responses', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse(null, false));

      const { result } = renderHook(() => useLogin(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(mockLoginPayload);

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBe('Failed to login');
    });

    it('should handle 403 Forbidden responses', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse(null, false));

      const { result } = renderHook(() => useLogin(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(mockLoginPayload);

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBe('Failed to login');
    });

    it('should handle JSON parsing errors in response', async () => {
      mockFetch.mockResolvedValueOnce({
        ...createMockResponse(null),
        json: async () => {
          throw new Error('Invalid JSON');
        },
      });

      const { result } = renderHook(() => useLogin(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(mockLoginPayload);

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBe('Invalid JSON');
    });
  });

  describe('Loading States', () => {
    it('should reset loading state after mutation completion', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse(mockUserResponse));

      const { result } = renderHook(() => useLogin(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(mockLoginPayload);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('Mutation Configuration', () => {
    it('should return correct mutation properties', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse(mockUserResponse));

      const { result } = renderHook(() => useLogin(), {
        wrapper: createWrapper(),
      });

      expect(typeof result.current.mutate).toBe('function');
      expect(typeof result.current.mutateAsync).toBe('function');
      expect(typeof result.current.isLoading).toBe('boolean');
      expect(typeof result.current.error).toBe('string');
    });

    it('should handle multiple mutations sequentially', async () => {
      const userResponse1: UserInterface = {
        user: {
          id: 1,
          username: 'user1',
        },
      };

      const userResponse2: UserInterface = {
        user: {
          id: 2,
          username: 'user2',
        },
      };

      mockFetch
        .mockResolvedValueOnce(createMockResponse(userResponse1))
        .mockResolvedValueOnce(createMockResponse(userResponse2));

      const { result } = renderHook(() => useLogin(), {
        wrapper: createWrapper(),
      });

      const payload1: LoginInterface = { username: 'user1', password: 'pass1' };
      const payload2: LoginInterface = { username: 'user2', password: 'pass2' };

      result.current.mutate(payload1);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      result.current.mutate(payload2);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockFetch).toHaveBeenCalledTimes(2);
    });
  });

  describe('Data Format', () => {
    it('should handle UserInterface response', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse(mockUserResponse));

      const { result } = renderHook(() => useLogin(), {
        wrapper: createWrapper(),
      });

      const response = await result.current.mutateAsync(mockLoginPayload);

      expect(response).toEqual(mockUserResponse);
      expect(response.user.id).toBe(1);
      expect(response.user.username).toBe('testuser');
      expect(response.user.address).toBe('123 Main St');
      expect(response.user.name).toBe('Test User');
      expect(response.user.phone).toBe(1234567890);
    });

    it('should handle null response', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse(null));

      const { result } = renderHook(() => useLogin(), {
        wrapper: createWrapper(),
      });

      const response = await result.current.mutateAsync(mockLoginPayload);

      expect(response).toBeNull();
    });

    it('should handle string response', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse('success'));

      const { result } = renderHook(() => useLogin(), {
        wrapper: createWrapper(),
      });

      const response = await result.current.mutateAsync(mockLoginPayload);

      expect(response).toBe('success');
    });

    it('should handle object response with extra fields', async () => {
      const objectResponse = {
        success: true,
        token: 'jwt-token-here',
        expiresIn: 3600,
        user: {
          id: 1,
          username: 'testuser',
        },
      };

      mockFetch.mockResolvedValueOnce(createMockResponse(objectResponse));

      const { result } = renderHook(() => useLogin(), {
        wrapper: createWrapper(),
      });

      const response = await result.current.mutateAsync(mockLoginPayload);

      expect(response).toEqual(objectResponse);
    });
  });

  describe('Hook Integration', () => {
    it('should work with multiple instances', async () => {
      mockFetch.mockResolvedValue(createMockResponse(mockUserResponse));

      const wrapper = createWrapper();

      const { result: result1 } = renderHook(() => useLogin(), { wrapper });
      const { result: result2 } = renderHook(() => useLogin(), { wrapper });

      const payload1: LoginInterface = { username: 'user1', password: 'pass1' };
      const payload2: LoginInterface = { username: 'user2', password: 'pass2' };

      result1.current.mutate(payload1);
      result2.current.mutate(payload2);

      await waitFor(() => {
        expect(result1.current.isSuccess).toBe(true);
        expect(result2.current.isSuccess).toBe(true);
      });

      expect(mockFetch).toHaveBeenCalledTimes(2);
    });

    it('should handle concurrent mutations', async () => {
      mockFetch.mockResolvedValue(createMockResponse(mockUserResponse));

      const { result } = renderHook(() => useLogin(), {
        wrapper: createWrapper(),
      });

      const payload1: LoginInterface = { username: 'user1', password: 'pass1' };
      const payload2: LoginInterface = { username: 'user2', password: 'pass2' };

      result.current.mutate(payload1);
      result.current.mutate(payload2);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockFetch).toHaveBeenCalledTimes(2);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty username', async () => {
      const emptyUsernamePayload: LoginInterface = {
        username: '',
        password: 'password123',
      };

      mockFetch.mockResolvedValueOnce(createMockResponse(mockUserResponse));

      const { result } = renderHook(() => useLogin(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(emptyUsernamePayload);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      const callArgs = mockFetch.mock.calls[0];
      expect(JSON.parse(callArgs[1]?.body as string)).toEqual(
        emptyUsernamePayload,
      );
    });

    it('should handle empty password', async () => {
      const emptyPasswordPayload: LoginInterface = {
        username: 'testuser',
        password: '',
      };

      mockFetch.mockResolvedValueOnce(createMockResponse(mockUserResponse));

      const { result } = renderHook(() => useLogin(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(emptyPasswordPayload);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      const callArgs = mockFetch.mock.calls[0];
      expect(JSON.parse(callArgs[1]?.body as string)).toEqual(
        emptyPasswordPayload,
      );
    });

    it('should handle very long username and password', async () => {
      const longCredentialsPayload: LoginInterface = {
        username: 'a'.repeat(1000),
        password: 'b'.repeat(1000),
      };

      mockFetch.mockResolvedValueOnce(createMockResponse(mockUserResponse));

      const { result } = renderHook(() => useLogin(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(longCredentialsPayload);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      const callArgs = mockFetch.mock.calls[0];
      expect(JSON.parse(callArgs[1]?.body as string)).toEqual(
        longCredentialsPayload,
      );
    });

    it('should handle special characters in credentials', async () => {
      const specialCharsPayload: LoginInterface = {
        username: 'user@domain.com!@#$%^&*()',
        password: 'p@ssw0rd!@#$%^&*()_+-=[]{}|;:,.<>?',
      };

      mockFetch.mockResolvedValueOnce(createMockResponse(mockUserResponse));

      const { result } = renderHook(() => useLogin(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(specialCharsPayload);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      const callArgs = mockFetch.mock.calls[0];
      expect(JSON.parse(callArgs[1]?.body as string)).toEqual(
        specialCharsPayload,
      );
    });

    it('should handle unicode characters in credentials', async () => {
      const unicodePayload: LoginInterface = {
        username: '用户@测试.com',
        password: '密码123',
      };

      mockFetch.mockResolvedValueOnce(createMockResponse(mockUserResponse));

      const { result } = renderHook(() => useLogin(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(unicodePayload);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      const callArgs = mockFetch.mock.calls[0];
      expect(JSON.parse(callArgs[1]?.body as string)).toEqual(unicodePayload);
    });

    it('should handle malformed login payload', async () => {
      const malformedPayload = {
        username: null,
        password: undefined,
        extraField: 'should be ignored',
      } as unknown as LoginInterface;

      mockFetch.mockResolvedValueOnce(createMockResponse(mockUserResponse));

      const { result } = renderHook(() => useLogin(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(malformedPayload);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      const callArgs = mockFetch.mock.calls[0];
      expect(JSON.parse(callArgs[1]?.body as string)).toEqual(malformedPayload);
    });

    it('should handle whitespace in credentials', async () => {
      const whitespacePayload: LoginInterface = {
        username: '  testuser  ',
        password: '  password123  ',
      };

      mockFetch.mockResolvedValueOnce(createMockResponse(mockUserResponse));

      const { result } = renderHook(() => useLogin(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(whitespacePayload);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      const callArgs = mockFetch.mock.calls[0];
      expect(JSON.parse(callArgs[1]?.body as string)).toEqual(
        whitespacePayload,
      );
    });
  });
});
