import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { map, Observable } from 'rxjs';
import { AdminDirective } from '../../../core/directives/admin.directive';
import { AuthService } from '../../../core/services/auth.service';
import { SnackBar } from '../../../core/services/snack-bar.service';
import { User } from '../../../shared/models/auth.model';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./toolbar.component.scss'],
  standalone: true,
  imports: [MatMenuModule, MatButtonModule, MatToolbarModule, MatIcon, MatDivider, AsyncPipe, AdminDirective],
})
export class ToolbarComponent {
  private readonly authService: AuthService = inject(AuthService);
  private readonly snackBar: SnackBar = inject(SnackBar);
  readonly currentUser: Observable<User | null> = this.authService.currentUser$;
  readonly currentUserNameView: Observable<string> = this.currentUser.pipe(
    map(
      (currentUser) =>
        currentUser?.firstName || currentUser?.credentials?.login || currentUser?.role?.roleType?.roleType,
    ),
  );
  readonly currentName: Observable<string> = this.currentUser.pipe(
    map((currentUser) => currentUser?.firstName || currentUser?.credentials?.login),
  );

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.snackBar.openSuccess('Logged out successfully');
      },
      error: (error) => {
        console.error('Logout error:', error);
        // Even if logout fails on server, we're redirected by the auth service
      },
    });
  }
}
