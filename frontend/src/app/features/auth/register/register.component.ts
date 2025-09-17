import {
  Component,
  OnInit,
  Signal,
  WritableSignal,
  computed,
  signal,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { SnackBar } from '../../../core/services/snack-bar.service';
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
  readonly registerForm: FormGroup = registerFormGroup();
  readonly hidePassword: WritableSignal<boolean> = signal(true);
  readonly passwordType: Signal<'password' | 'text'> = computed(() =>
    this.hidePassword() ? 'password' : 'text'
  );
  readonly iconVisibility: Signal<'visibility_off' | 'visibility'> = computed(
    () => (this.hidePassword() ? 'visibility_off' : 'visibility')
  );
  readonly hideConfirmPassword: WritableSignal<boolean> = signal(true);
  readonly confirmPasswordType: Signal<'password' | 'text'> = computed(() =>
    this.hideConfirmPassword() ? 'password' : 'text'
  );
  readonly confirmIconVisibility: Signal<'visibility_off' | 'visibility'> =
    computed(() =>
      this.hideConfirmPassword() ? 'visibility_off' : 'visibility'
    );
  readonly isLoading: WritableSignal<boolean> = signal(false);

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly snackBar: SnackBar
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
          this.snackBar.openSuccess(
            'Registration successful! Welcome to Sports Activity Diary!'
          );
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.isLoading.set(false);
          this.snackBar.openError(
            error || 'Registration failed. Please try again.'
          );
        },
      });
    }
  }
}
