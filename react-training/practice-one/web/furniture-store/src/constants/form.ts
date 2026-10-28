export const FormSubmitState = {
  IDLE: 'idle',
  SUBMITTING: 'submitting',
  SUCCESS: 'success',
  ERROR: 'error',
} as const;

export type FormSubmitState = (typeof FormSubmitState)[keyof typeof FormSubmitState];

export const SUBMIT_BUTTON_LABELS = {
  // Payment
  PAY_NOW: 'Pay Now',
  PROCESSING: 'Processing...',

  // Auth
  LOGIN: 'Login',
  LOGGING_IN: 'Logging in...',
  CREATE_ACCOUNT: 'Create account',
  CREATING: 'Creating...',

  // General
  SUBMIT: 'Submit',
  SUBMITTING: 'Submitting...',
  SAVE: 'Save',
  SAVING: 'Saving...',
} as const;

export const DIALOG_TYPES = {
  ERROR: 'Error',
  SUCCESS: 'Success',
  WARNING: 'Warning',
  INFO: 'Info',
} as const;

export type DialogType = (typeof DIALOG_TYPES)[keyof typeof DIALOG_TYPES];

export const DIALOG_ACTIONS = {
  OK: 'OK',
  CANCEL: 'Cancel',
  CONFIRM: 'Confirm',
  CLOSE: 'Close',
} as const;

export type DialogAction = (typeof DIALOG_ACTIONS)[keyof typeof DIALOG_ACTIONS];
