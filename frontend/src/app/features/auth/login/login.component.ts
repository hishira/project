import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { LoginDto } from '../../../shared/models/auth.model';
import { TextInputComponent } from '../../../core/components/inputs/text-input/text-input.component';
import { loginValidators } from './login-validators';
import { AuthFormSubmissionService } from '../shared/auth-form-submission.service';
import { LOGIN_FORM_ERRORS } from '../shared/auth-error-messages';

@Component({
  selector: 'app-login',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    TextInputComponent,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly submissionService = inject(AuthFormSubmissionService);

  readonly loginValidators = loginValidators;
  readonly formErrors = LOGIN_FORM_ERRORS;
  readonly isLoading = signal(false);
  
  loginForm: FormGroup = this.createLoginForm();

  onSubmit(): void {
    if (this.loginForm.valid && !this.isLoading()) {
      this.isLoading.set(true);
      const loginData: LoginDto = this.loginForm.value;

      this.authService.login(loginData).subscribe({
        next: () => {
          this.isLoading.set(false);
          this.submissionService.handleAuthSuccess('Login successful');
        },
        error: (error) => {
          this.isLoading.set(false);
          this.submissionService.handleAuthError(error, 'Login failed. Please try again.');
        },
      });
    }
  }

  private createLoginForm(): FormGroup {
    return this.formBuilder.group({
      identifier: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }
}
