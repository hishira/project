import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbar } from '@angular/material/toolbar';
import { Store } from '@ngrx/store';
import { AdminDirective } from '../../../core/directives/admin.directive';
import { AuthService } from '../../../core/services/auth.service';
import { SnackBar } from '../../../core/services/snack-bar.service';
import { userSelector } from '../../../store/user';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./toolbar.component.scss'],
  standalone: true,
  imports: [
    MatToolbar,
    MatIcon,
    MatMenuModule,
    MatDivider,
    MatButtonModule,
    AdminDirective,
  ],
})
export class ToolbarComponent implements OnInit {
  private readonly authService: AuthService = inject(AuthService);
  currentUser: any = this.authService.currentUser$.subscribe((user) => {
    this.currentUser = user;
  });
  private readonly snackBar: SnackBar = inject(SnackBar);
  private readonly store: Store = inject(Store);

  ngOnInit(): void {
    this.store.select(userSelector).subscribe(console.log);
  }
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
