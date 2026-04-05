import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { MatSidenavModule, MatDrawer } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatDivider } from '@angular/material/divider';
import { AuthService } from '../../services/auth.service';
import { SnackBar } from '../../services/snack-bar.service';
import { ToolbarComponent } from '../../../features/dashboard/toolbar/toolbar.component';

@Component({
  selector: 'app-layout',
  templateUrl: './app-layout.component.html',
  styleUrl: './app-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    RouterOutlet, 
    RouterLink,
    ToolbarComponent,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatDivider
  ],
})
export class AppLayoutComponent {
  private authService = inject(AuthService);
  private snackBar = inject(SnackBar);
  private router = inject(Router);

  drawerOpened = false;

  toggleDrawer(): void {
    this.drawerOpened = !this.drawerOpened;
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
