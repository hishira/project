import { Validators } from '@angular/forms';
import { LOGIN_FORM_ERRORS } from '../shared/auth-error-messages';
import { InputValidation } from '../../../core/components/inputs/types';

/**
 * Login form field validators configuration.
 * Defines validation rules and error messages for login form fields.
 */
export const loginValidators = {
  login: [
    {
      name: 'required',
      validator: Validators.required,
      message: LOGIN_FORM_ERRORS.identifier.required,
    },
  ],
  password: [
    {
      name: 'required',
      validator: Validators.required,
      message: LOGIN_FORM_ERRORS.password.required,
    },
  ],
} as { login: InputValidation[]; password: InputValidation[] };