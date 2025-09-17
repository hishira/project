import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';

export const registerFormGroup = () =>
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
        Validators.pattern(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/
        ),
      ]),
      confirmPassword: new FormControl('', [Validators.required]),
    },
    { validators: [passwordMatchValidator] }
  );

export const passwordMatchValidator: ValidatorFn =
  () =>
  (formGroup: FormGroup): ValidationErrors | null => {
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

export const registerComponentsImports = [
  CommonModule,
  ReactiveFormsModule,
  RouterModule,
  MatCardModule,
  MatFormFieldModule,
  MatInputModule,
  MatButtonModule,
  MatIconModule,
  MatProgressSpinnerModule,
  MatSnackBarModule,
];
