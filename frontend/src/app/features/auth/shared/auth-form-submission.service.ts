import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SnackBar } from '../../../core/services/snack-bar.service';
import { AuthService } from '../../../core/services/auth.service';

/**
 * Handles common authentication form submission logic.
 * Reduces duplication between login and register components.
 * Responsibilities:
 * - Coordinate auth service calls with user feedback (snackbar)
 * - Handle navigation after successful authentication
 * - Manage error handling for auth operations
 */
@Injectable({
  providedIn: 'root',
})
export class AuthFormSubmissionService {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly snackBar = inject(SnackBar);

  /**
   * Handles successful authentication flow.
   * Displays success message and navigates to dashboard.
   */
  handleAuthSuccess(message: string = 'Operation successful'): void {
    this.snackBar.openSuccess(message);
    this.router.navigate(['/dashboard']);
  }

  /**
   * Handles authentication errors.
   * Displays error message to user.
   */
  handleAuthError(error: unknown, fallbackMessage: string): void {
    const errorMessage = typeof error === 'string' ? error : fallbackMessage;
    this.snackBar.openError(errorMessage);
  }
}
