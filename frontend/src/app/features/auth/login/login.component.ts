import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  OnInit,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import {
  FormControl,
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
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { SnackBar } from '../../../core/services/snack-bar.service';
import { LoginDto } from '../../../shared/models/auth.model';
import { TextInputComponent } from '../../../core/components/inputs/text-input/text-input.component';
import { CompanyGenericEdit, emptyFormGroup, loginValidators } from './login-validators';
import {GenericForm} from 'generic-form'
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
    MatSnackBarModule,
    TextInputComponent,
    GenericForm
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  
  readonly loginValidators = loginValidators;
  readonly isLoading: WritableSignal<boolean> = signal(false);
  genericEditDefinition = CompanyGenericEdit();
  group = emptyFormGroup()
  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly snackBar: SnackBar
  ) {
    this.loginForm = new FormGroup({
      identifier: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    });
  }

  
  ngOnInit(): void {
    this.loginForm.valueChanges.subscribe(a=>console.log('FORM', a))
    // Redirect if already authenticated
    // if (this.authService.isAuthenticated()) {
    //   this.router.navigate(['dashboard']);
    // }
  }

  onSubmit(): void {
    if (this.loginForm.valid && !this.isLoading()) {
      this.isLoading.set(true);
      const loginData: LoginDto = this.loginForm.value;

      //this.router.navigate(['/dashboard']);
      this.authService.login(loginData).subscribe({
        next: () => {
          this.isLoading.set(false);
          this.snackBar.openSuccess('Login successful');

          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.isLoading.set(false);
          this.snackBar.openError(error || 'Login failed. Please try again.');
        },
      });
    }
  }
}
