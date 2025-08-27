import { Component, inject } from '@angular/core';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatToolbar } from '@angular/material/toolbar';
import { AuthService } from '../../../core/services/auth.service';
import { MatButtonModule } from "@angular/material/button";

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  standalone: true,
  imports: [MatToolbar, MatIcon, MatMenuModule, MatDivider, MatButtonModule],
})
export class ToolbarComponent {
    private readonly authService: AuthService = inject(AuthService);
  currentUser: any = this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  private readonly snackBar: MatSnackBar = inject(MatSnackBar);

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.snackBar.open('Logged out successfully', 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar'],
        });
      },
      error: (error) => {
        console.error('Logout error:', error);
        // Even if logout fails on server, we're redirected by the auth service
      },
    });
  }
}
