import { CommonModule } from '@angular/common';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';
import { TextInputComponent } from '../../../core/components/inputs/text-input/text-input.component';
import { REGISTER_FORM_ERRORS } from '../shared/auth-error-messages';

/**
 * Validates that password and confirmPassword fields match.
 * Applied at form group level to validate cross-field dependencies.
 */
const validatePasswordsMatch: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const formGroup = control as FormGroup;
  const password = formGroup.get('password');
  const confirmPassword = formGroup.get('confirmPassword');

  if (!password || !confirmPassword) {
    return null;
  }

  if (password.value !== confirmPassword.value) {
    confirmPassword.setErrors({ passwordMismatch: true });
    return { passwordMismatch: true };
  } else {
    confirmPassword.setErrors(null);
    return null;
  }
};

/**
 * Factory function to create a pre-configured register form group.
 * Encapsulates form structure and validation rules in one place.
 */
export const registerFormGroup = (): FormGroup =>
  new FormGroup(
    {
      firstName: new FormControl(''),
      lastName: new FormControl(''),
      login: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
        Validators.pattern(/^[a-zA-Z0-9_-]+$/),
      ]),
      email: new FormControl('', [
        Validators.required,
        Validators.email,
        Validators.maxLength(255),
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/),
      ]),
      confirmPassword: new FormControl('', [Validators.required]),
    },
    { validators: [validatePasswordsMatch] }
  );

export const registerComponentsImports = [
  CommonModule,
  ReactiveFormsModule,
  RouterModule,
  MatCardModule,
  MatButtonModule,
  MatProgressSpinnerModule,
  MatSnackBarModule,
  TextInputComponent,
  MatIconModule,
];

// Re-export error messages for use in component
export { REGISTER_FORM_ERRORS };

