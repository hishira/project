import { ChangeDetectionStrategy, Component, inject, output } from '@angular/core';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthenticationService } from '../services/auth.service';
import { SnackBar } from './../services/snack-bar.service';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    MatIcon,
    MatDivider,
  ],
})
export class SideNavComponent {
  private authService = inject(AuthenticationService);
  private snackBar = inject(SnackBar);
  private router = inject(Router);

  readonly closed = output<void>();

  close(): void {
    this.closed.emit();
  }

  async logout(): Promise<void> {
    try {
      await firstValueFrom(this.authService.logout());
      this.snackBar.openSuccess('Logged out successfully');
      this.router.navigate(['/auth/login']);
    } catch (error) {
      console.error('Logout error:', error);
      this.snackBar.openError('Unable to log out. Please try again.');
    }
  }
}
