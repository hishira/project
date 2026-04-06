import { ChangeDetectionStrategy, Component, inject, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { MatDivider } from '@angular/material/divider';
import { AuthService } from '../../services/auth.service';
import { SnackBar } from '../../services/snack-bar.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    RouterLink,
    MatIcon,
    MatDivider
  ],
})
export class SideNavComponent {
  private authService = inject(AuthService);
  private snackBar = inject(SnackBar);
  private router = inject(Router);

  closed = output<void>();

  close(): void {
    this.closed.emit();
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.snackBar.openSuccess('Logged out successfully');
        this.router.navigate(['/auth/login']);
      },
      error: (error) => {
        console.error('Logout error:', error);
      },
    });
  }
}
