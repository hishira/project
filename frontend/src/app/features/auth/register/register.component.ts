import {
  ChangeDetectionStrategy,
  Component,
  inject,
  resource,
  signal,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { RegisterDto } from '../../../shared/models/auth.model';
import { AuthFormSubmissionService } from '../shared/auth-form-submission.service';
import { REGISTER_FORM_ERRORS, registerComponentsImports, registerFormGroup } from './consts';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './registe.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [...registerComponentsImports],
})
export class RegisterComponent {
  private readonly authService = inject(AuthService);
  private readonly submissionService = inject(AuthFormSubmissionService);

  readonly registerForm: FormGroup = registerFormGroup();
  readonly isLoading = signal(false);
  readonly formErrors = REGISTER_FORM_ERRORS;

  onSubmit(): void {
    if (!this.registerForm.valid || this.isLoading()) return;
    this.isLoading.set(true);

    const { confirmPassword, ...registerData } = this.registerForm.value;
    const registerDto: RegisterDto = registerData;

    this.authService.register(registerDto).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.submissionService.handleAuthSuccess(
          'Registration successful! Welcome to application!'
        );
      },
      error: (error) => {
        this.isLoading.set(false);
        this.submissionService.handleAuthError(
          error,
          'Registration failed. Please try again.'
        );
      },
    });
  }
}
