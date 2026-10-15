export const ToastType = {
  SUCCESS: 'success',
  ERROR: 'error',
  INFO: 'info',
  WARNING: 'warning',
} as const;

export type ToastType = (typeof ToastType)[keyof typeof ToastType];

export const TOAST_MESSAGES = {
  // Cart messages
  ADD_TO_CART_SUCCESS: (productName: string) =>
    `Product ${productName} has been added to your cart`,
  INSUFFICIENT_STOCK: (productName: string, availableStock: number) =>
    `Sorry, only ${availableStock} item(s) available in stock for ${productName}. Please help check to your cart`,
  ADD_TO_CART_FAILED: 'Failed to add product to cart. Please try again.',

  // Auth messages
  FORGOT_PASSWORD_UNAVAILABLE:
    'Forgot password is not available yet. Please contact support to reset your password.',
  GOOGLE_LOGIN_UNAVAILABLE:
    'Google login is not available yet. Please use email/password to login.',
  APPLE_LOGIN_UNAVAILABLE:
    'Apple login is not available yet. Please use email/password to login.',
  LOGIN_REQUIRED: 'You must be logged in to perform this action',

  // Legal messages
  TERMS_UNAVAILABLE: 'Terms and Conditions is not available yet.',
  PRIVACY_POLICY_UNAVAILABLE: 'Privacy Policy is not available yet.',

  // Success messages
  SIGNUP_SUCCESS: 'Account created successfully!',
  LOGIN_SUCCESS: 'Login successful!',
} as const;

export const TOAST_CONFIG = {
  DEFAULT: {
    duration: 3000,
    className: 'text-left',
  },
  ERROR: {
    duration: 5000,
    className: 'text-left',
  },
  SUCCESS: {
    duration: 3000,
    className: 'text-left',
  },
} as const;
