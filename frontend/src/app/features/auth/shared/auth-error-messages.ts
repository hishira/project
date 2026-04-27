/**
 * Centralized error messages for authentication forms.
 * Follows DRY principle by extracting hardcoded strings from templates.
 */
export const LOGIN_FORM_ERRORS = {
  identifier: {
    required: 'Email or username is required',
  },
  password: {
    required: 'Password is required',
  },
};

export const REGISTER_FORM_ERRORS = {
  firstName: {
    required: 'First name is required',
  },
  lastName: {
    required: 'Last name is required',
  },
  login: {
    required: 'Username is required',
    minlength: 'Username must be at least 3 characters long',
    pattern: 'Username can only contain letters, numbers, underscores, and hyphens',
  },
  email: {
    required: 'Email is required',
    email: 'Please enter a valid email address',
  },
  password: {
    required: 'Password is required',
    minlength: 'Password must be at least 8 characters long',
    pattern: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
  },
  confirmPassword: {
    required: 'Password confirmation is required',
    passwordMismatch: 'Passwords do not match',
  },
};
