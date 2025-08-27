import {
  Component,
  computed,
  OnInit,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/services/auth.service';
import { LoginDto } from '../../../shared/models/auth.model';

@Component({
  selector: 'app-login',
  standalone: true,
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
    MatSnackBarModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  readonly hidePassword: WritableSignal<boolean> = signal(true);
  readonly isLoading: WritableSignal<boolean> = signal(false);
  readonly passwordType: Signal<'password' | 'text'> = computed(() =>
    this.hidePassword() ? 'password' : 'text'
  );
  readonly passwordIcon: Signal<'visibility_off' | 'visibility'> = computed(
    () => (this.hidePassword() ? 'visibility_off' : 'visibility')
  );
  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly snackBar: MatSnackBar
  ) {
    this.loginForm = new FormGroup({
      identifier: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    });
  }

  passwordHide(): void {
    this.hidePassword.update((hide) => !hide);
  }

  ngOnInit(): void {
    // Redirect if already authenticated
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }

  onSubmit(): void {
    if (this.loginForm.valid && !this.isLoading()) {
      this.isLoading.set(true);
      const loginData: LoginDto = this.loginForm.value;
      
       this.router.navigate(['/dashboard']);
      // this.authService.login(loginData).subscribe({
      //   next: (response) => {
      //     this.isLoading.set(false);
      //     this.snackBar.open('Login successful!', 'Close', {
      //       duration: 3000,
      //       panelClass: ['success-snackbar'],
      //     });
      //     this.router.navigate(['/dashboard']);
      //   },
      //   error: (error) => {
      //     this.isLoading.set(false);
      //     this.snackBar.open(
      //       error || 'Login failed. Please try again.',
      //       'Close',
      //       {
      //         duration: 5000,
      //         panelClass: ['error-snackbar'],
      //       }
      //     );
      //   },
      // });
    }
  }
}
