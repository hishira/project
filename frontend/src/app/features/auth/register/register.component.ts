import {
  Component,
  OnInit,
  Signal,
  WritableSignal,
  computed,
  signal,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { RegisterDto } from '../../../shared/models/auth.model';
import { registerComponentsImports, registerFormGroup } from './consts';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [...registerComponentsImports],
  templateUrl: './register.component.html',
  styleUrl: './registe.component.scss',
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup = registerFormGroup();
  hidePassword: WritableSignal<boolean> = signal(true);
  passwordType: Signal<'password' | 'text'> = computed(() =>
    this.hidePassword() ? 'password' : 'text'
  );
  iconVisibility: Signal<'visibility_off' | 'visibility'> = computed(() =>
    this.hidePassword() ? 'visibility_off' : 'visibility'
  );
  hideConfirmPassword: WritableSignal<boolean> = signal(true);
  confirmPasswordType: Signal<'password' | 'text'> = computed(() =>
    this.hideConfirmPassword() ? 'password' : 'text'
  );
  confirmIconVisibility: Signal<'visibility_off' | 'visibility'> = computed(
    () => (this.hideConfirmPassword() ? 'visibility_off' : 'visibility')
  );
  isLoading: WritableSignal<boolean> = signal(false);

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly snackBar: MatSnackBar
  ) {}

  updateHidePassword(): void {
    this.hidePassword.update((hide) => !hide);
  }

  updateConfirmHidePassword(): void {
    this.hideConfirmPassword.update((hide) => !hide);
  }

  ngOnInit(): void {
    // Redirect if already authenticated
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }

  onSubmit(): void {
    if (this.registerForm.valid && !this.isLoading()) {
      this.isLoading.set(true);

      const { confirmPassword, ...registerData } = this.registerForm.value;
      const registerDto: RegisterDto = registerData;

      this.authService.register(registerDto).subscribe({
        next: (response) => {
          this.isLoading.set(false);
          this.snackBar.open(
            'Registration successful! Welcome to Sports Activity Diary!',
            'Close',
            {
              duration: 5000,
              panelClass: ['success-snackbar'],
            }
          );
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.isLoading.set(false);
          this.snackBar.open(
            error || 'Registration failed. Please try again.',
            'Close',
            {
              duration: 5000,
              panelClass: ['error-snackbar'],
            }
          );
        },
      });
    }
  }
}
