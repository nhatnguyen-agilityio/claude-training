import { createElement, type ReactNode } from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useSignUp } from './signup';
import type { SignUpInterface } from '../interfaces/signup';

jest.mock('../constants/api-routers', () => ({
  API_ROUTES: {
    SIGN_UP: '/signup',
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

const mockSignUpPayload: SignUpInterface = {
  username: 'newuser',
  password: 'newpassword123',
  address: '456 Oak Ave',
  name: 'New User',
  phone: 9876543210,
};

const mockSuccessResponse = 'User created successfully';

describe('useSignUp', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch.mockReset();
  });

  describe('Successful Mutations', () => {
    it('should successfully sign up with valid payload', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse(mockSuccessResponse));

      const { result } = renderHook(() => useSignUp(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(mockSignUpPayload);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it('should call POST endpoint with correct URL and payload', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse(mockSuccessResponse));

      const { result } = renderHook(() => useSignUp(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(mockSignUpPayload);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockFetch).toHaveBeenCalledTimes(1);
      const callArgs = mockFetch.mock.calls[0];
      expect(callArgs[0].toString()).toBe('http://localhost:3001/signup');
      expect(callArgs[1]?.method).toBe('POST');
      expect(callArgs[1]?.headers).toEqual({
        'Content-Type': 'application/json',
      });
      expect(JSON.parse(callArgs[1]?.body as string)).toEqual(
        mockSignUpPayload,
      );
    });

    it('should handle async mutation with mutateAsync', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse(mockSuccessResponse));

      const { result } = renderHook(() => useSignUp(), {
        wrapper: createWrapper(),
      });

      const response = await result.current.mutateAsync(mockSignUpPayload);

      expect(response).toBe(mockSuccessResponse);
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it('should handle signup with minimal required fields', async () => {
      const minimalPayload: SignUpInterface = {
        username: 'minimaluser',
        password: 'minimalpass',
      };

      mockFetch.mockResolvedValueOnce(createMockResponse(mockSuccessResponse));

      const { result } = renderHook(() => useSignUp(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(minimalPayload);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      const callArgs = mockFetch.mock.calls[0];
      expect(JSON.parse(callArgs[1]?.body as string)).toEqual(minimalPayload);
    });

    it('should handle signup with all optional fields', async () => {
      const completePayload: SignUpInterface = {
        username: 'completeuser',
        password: 'completepass',
        address: '123 Main Street, Suite 100, City, State 12345',
        name: 'Complete User Name',
        phone: 5551234567,
      };

      mockFetch.mockResolvedValueOnce(createMockResponse(mockSuccessResponse));

      const { result } = renderHook(() => useSignUp(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(completePayload);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      const callArgs = mockFetch.mock.calls[0];
      expect(JSON.parse(callArgs[1]?.body as string)).toEqual(completePayload);
    });

    it('should handle signup with different username formats', async () => {
      const emailUsernamePayload: SignUpInterface = {
        username: 'user@example.com',
        password: 'password123',
        name: 'Email User',
      };

      mockFetch.mockResolvedValueOnce(createMockResponse(mockSuccessResponse));

      const { result } = renderHook(() => useSignUp(), {
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

    it('should handle signup with partial optional fields', async () => {
      const partialPayload: SignUpInterface = {
        username: 'partialuser',
        password: 'partialpass',
        name: 'Partial User',
        // address and phone are omitted
      };

      mockFetch.mockResolvedValueOnce(createMockResponse(mockSuccessResponse));

      const { result } = renderHook(() => useSignUp(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(partialPayload);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      const callArgs = mockFetch.mock.calls[0];
      expect(JSON.parse(callArgs[1]?.body as string)).toEqual(partialPayload);
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors', async () => {
      const networkError = new Error('Network response was not ok');
      mockFetch.mockRejectedValueOnce(networkError);

      const { result } = renderHook(() => useSignUp(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(mockSignUpPayload);

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBe('Network response was not ok');
      expect(result.current.isLoading).toBe(false);
    });

    it('should handle HTTP error responses', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse(null, false));

      const { result } = renderHook(() => useSignUp(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(mockSignUpPayload);

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBe('Failed to create user');
      expect(result.current.isLoading).toBe(false);
    });

    it('should handle HTTP error with custom error message', async () => {
      const errorResponse = {
        error: 'Username already exists',
      };

      mockFetch.mockResolvedValueOnce({
        ...createMockResponse(errorResponse, false),
        json: async () => errorResponse,
      });

      const { result } = renderHook(() => useSignUp(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(mockSignUpPayload);

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBe('Username already exists');
    });

    it('should handle HTTP error with malformed error response', async () => {
      mockFetch.mockResolvedValueOnce({
        ...createMockResponse(null, false),
        json: async () => {
          throw new Error('Invalid JSON');
        },
      });

      const { result } = renderHook(() => useSignUp(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(mockSignUpPayload);

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBe('Failed to create user');
    });

    it('should handle 409 Conflict responses', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse(null, false));

      const { result } = renderHook(() => useSignUp(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(mockSignUpPayload);

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBe('Failed to create user');
    });

    it('should handle 400 Bad Request responses', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse(null, false));

      const { result } = renderHook(() => useSignUp(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(mockSignUpPayload);

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBe('Failed to create user');
    });

    it('should handle JSON parsing errors in response', async () => {
      mockFetch.mockResolvedValueOnce({
        ...createMockResponse(null),
        json: async () => {
          throw new Error('Invalid JSON');
        },
      });

      const { result } = renderHook(() => useSignUp(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(mockSignUpPayload);

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBe('Invalid JSON');
    });
  });

  describe('Loading States', () => {
    it('should reset loading state after mutation completion', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse(mockSuccessResponse));

      const { result } = renderHook(() => useSignUp(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(mockSignUpPayload);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('Mutation Configuration', () => {
    it('should return correct mutation properties', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse(mockSuccessResponse));

      const { result } = renderHook(() => useSignUp(), {
        wrapper: createWrapper(),
      });

      expect(typeof result.current.mutate).toBe('function');
      expect(typeof result.current.mutateAsync).toBe('function');
      expect(typeof result.current.isLoading).toBe('boolean');
      expect(typeof result.current.error).toBe('string');
    });

    it('should handle multiple mutations sequentially', async () => {
      const successResponse1 = 'User 1 created successfully';
      const successResponse2 = 'User 2 created successfully';

      mockFetch
        .mockResolvedValueOnce(createMockResponse(successResponse1))
        .mockResolvedValueOnce(createMockResponse(successResponse2));

      const { result } = renderHook(() => useSignUp(), {
        wrapper: createWrapper(),
      });

      const payload1: SignUpInterface = {
        username: 'user1',
        password: 'pass1',
      };
      const payload2: SignUpInterface = {
        username: 'user2',
        password: 'pass2',
      };

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
    it('should handle string response', async () => {
      const stringResponse = 'User created successfully';

      mockFetch.mockResolvedValueOnce(createMockResponse(stringResponse));

      const { result } = renderHook(() => useSignUp(), {
        wrapper: createWrapper(),
      });

      const response = await result.current.mutateAsync(mockSignUpPayload);

      expect(response).toBe(stringResponse);
    });

    it('should handle null response', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse(null));

      const { result } = renderHook(() => useSignUp(), {
        wrapper: createWrapper(),
      });

      const response = await result.current.mutateAsync(mockSignUpPayload);

      expect(response).toBeNull();
    });

    it('should handle object response', async () => {
      const objectResponse = {
        success: true,
        message: 'User created successfully',
        userId: 123,
      };

      mockFetch.mockResolvedValueOnce(createMockResponse(objectResponse));

      const { result } = renderHook(() => useSignUp(), {
        wrapper: createWrapper(),
      });

      const response = await result.current.mutateAsync(mockSignUpPayload);

      expect(response).toEqual(objectResponse);
    });

    it('should handle boolean response', async () => {
      const booleanResponse = true;

      mockFetch.mockResolvedValueOnce(createMockResponse(booleanResponse));

      const { result } = renderHook(() => useSignUp(), {
        wrapper: createWrapper(),
      });

      const response = await result.current.mutateAsync(mockSignUpPayload);

      expect(response).toBe(true);
    });

    it('should handle array response', async () => {
      const arrayResponse = ['User created', 'Welcome email sent'];

      mockFetch.mockResolvedValueOnce(createMockResponse(arrayResponse));

      const { result } = renderHook(() => useSignUp(), {
        wrapper: createWrapper(),
      });

      const response = await result.current.mutateAsync(mockSignUpPayload);

      expect(response).toEqual(arrayResponse);
    });
  });

  describe('Hook Integration', () => {
    it('should work with multiple instances', async () => {
      mockFetch.mockResolvedValue(createMockResponse(mockSuccessResponse));

      const wrapper = createWrapper();

      const { result: result1 } = renderHook(() => useSignUp(), { wrapper });
      const { result: result2 } = renderHook(() => useSignUp(), { wrapper });

      const payload1: SignUpInterface = {
        username: 'user1',
        password: 'pass1',
      };
      const payload2: SignUpInterface = {
        username: 'user2',
        password: 'pass2',
      };

      result1.current.mutate(payload1);
      result2.current.mutate(payload2);

      await waitFor(() => {
        expect(result1.current.isSuccess).toBe(true);
        expect(result2.current.isSuccess).toBe(true);
      });

      expect(mockFetch).toHaveBeenCalledTimes(2);
    });

    it('should handle concurrent mutations', async () => {
      mockFetch.mockResolvedValue(createMockResponse(mockSuccessResponse));

      const { result } = renderHook(() => useSignUp(), {
        wrapper: createWrapper(),
      });

      const payload1: SignUpInterface = {
        username: 'user1',
        password: 'pass1',
      };
      const payload2: SignUpInterface = {
        username: 'user2',
        password: 'pass2',
      };

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
      const emptyUsernamePayload: SignUpInterface = {
        username: '',
        password: 'password123',
      };

      mockFetch.mockResolvedValueOnce(createMockResponse(mockSuccessResponse));

      const { result } = renderHook(() => useSignUp(), {
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
      const emptyPasswordPayload: SignUpInterface = {
        username: 'testuser',
        password: '',
      };

      mockFetch.mockResolvedValueOnce(createMockResponse(mockSuccessResponse));

      const { result } = renderHook(() => useSignUp(), {
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
      const longCredentialsPayload: SignUpInterface = {
        username: 'a'.repeat(1000),
        password: 'b'.repeat(1000),
        name: 'c'.repeat(1000),
      };

      mockFetch.mockResolvedValueOnce(createMockResponse(mockSuccessResponse));

      const { result } = renderHook(() => useSignUp(), {
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

    it('should handle special characters in all fields', async () => {
      const specialCharsPayload: SignUpInterface = {
        username: 'user@domain.com!@#$%^&*()',
        password: 'p@ssw0rd!@#$%^&*()_+-=[]{}|;:,.<>?',
        address: '123 Main St & Oak Ave, Apt #4B, City/State',
        name: 'José González',
        phone: 1234567890,
      };

      mockFetch.mockResolvedValueOnce(createMockResponse(mockSuccessResponse));

      const { result } = renderHook(() => useSignUp(), {
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

    it('should handle unicode characters in all fields', async () => {
      const unicodePayload: SignUpInterface = {
        username: '用户@测试.com',
        password: '密码123',
        address: '北京市朝阳区测试街道123号',
        name: '张三',
        phone: 1234567890,
      };

      mockFetch.mockResolvedValueOnce(createMockResponse(mockSuccessResponse));

      const { result } = renderHook(() => useSignUp(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(unicodePayload);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      const callArgs = mockFetch.mock.calls[0];
      expect(JSON.parse(callArgs[1]?.body as string)).toEqual(unicodePayload);
    });

    it('should handle malformed signup payload', async () => {
      const malformedPayload = {
        username: null,
        password: undefined,
        address: 123, // should be string
        name: true, // should be string
        phone: 'invalid', // should be number
        extraField: 'should be ignored',
      } as unknown as SignUpInterface;

      mockFetch.mockResolvedValueOnce(createMockResponse(mockSuccessResponse));

      const { result } = renderHook(() => useSignUp(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(malformedPayload);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      const callArgs = mockFetch.mock.calls[0];
      expect(JSON.parse(callArgs[1]?.body as string)).toEqual(malformedPayload);
    });

    it('should handle whitespace in all fields', async () => {
      const whitespacePayload: SignUpInterface = {
        username: '  testuser  ',
        password: '  password123  ',
        address: '  123 Main St  ',
        name: '  Test User  ',
        phone: 1234567890,
      };

      mockFetch.mockResolvedValueOnce(createMockResponse(mockSuccessResponse));

      const { result } = renderHook(() => useSignUp(), {
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

    it('should handle zero phone number', async () => {
      const zeroPhonePayload: SignUpInterface = {
        username: 'testuser',
        password: 'password123',
        phone: 0,
      };

      mockFetch.mockResolvedValueOnce(createMockResponse(mockSuccessResponse));

      const { result } = renderHook(() => useSignUp(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(zeroPhonePayload);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      const callArgs = mockFetch.mock.calls[0];
      expect(JSON.parse(callArgs[1]?.body as string)).toEqual(zeroPhonePayload);
    });

    it('should handle negative phone number', async () => {
      const negativePhonePayload: SignUpInterface = {
        username: 'testuser',
        password: 'password123',
        phone: -1234567890,
      };

      mockFetch.mockResolvedValueOnce(createMockResponse(mockSuccessResponse));

      const { result } = renderHook(() => useSignUp(), {
        wrapper: createWrapper(),
      });

      result.current.mutate(negativePhonePayload);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      const callArgs = mockFetch.mock.calls[0];
      expect(JSON.parse(callArgs[1]?.body as string)).toEqual(
        negativePhonePayload,
      );
    });
  });
});
