import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  signal,
  WritableSignal
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { SnackBar } from '../../../core/services/snack-bar.service';
import { RegisterDto } from '../../../shared/models/auth.model';
import { registerComponentsImports, registerFormGroup } from './consts';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './registe.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [...registerComponentsImports],
})
export class RegisterComponent implements OnInit {
  readonly registerForm: FormGroup = registerFormGroup();
  
  readonly isLoading: WritableSignal<boolean> = signal(false);

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly snackBar: SnackBar
  ) {}

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
            'Registration successful! Welcome to application!'
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
