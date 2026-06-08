import { ChangeDetectionStrategy, Component, inject, output } from '@angular/core';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { SnackBar } from '../../services/snack-bar.service';
import { SideNavElement } from 'layout'

const SideNavElement: SideNavElement[] = [
  {
    title: 'Dashboard',
    link: 'dashboard',
    icon: 'dashboard',
    customClickHandle: () => Promise.resolve(true)
  },
  {
    title: 'Users',
    link: 'users',
    icon: 'people',
    customClickHandle: () => Promise.resolve(true)
  },
  {
    title: 'Tickets',
    link: 'tickets',
    icon: 'confirmation_number',
    customClickHandle: () => Promise.resolve(true)
  },
  {
    title: 'Agreements',
    link: 'agreements',
    icon: 'description',
    customClickHandle: () => Promise.resolve(true)
  },
  {
    title: 'Raports',
    link: 'raports',
    icon: 'assessment',
    customClickHandle: () => Promise.resolve(true)
  },
  {
    title: 'Marketing',
    link: 'marketing',
    icon: 'campaign',
    customClickHandle: () => Promise.resolve(true)
  },
  {
    title: 'Documents',
    link: 'documents',
    icon: 'folder',
    customClickHandle: () => Promise.resolve(true)
  },
  {
    title: 'Clients',
    link: 'clients',
    icon: 'business',
    customClickHandle: () => Promise.resolve(true)
  },
  {
    title: 'Knowledge Base',
    link: 'knowledge-base',
    icon: 'menu_book',
    customClickHandle: () => Promise.resolve(true)
  },
  {
    title: 'Tasks',
    link: 'tasks',
    icon: 'task',
    customClickHandle: () => Promise.resolve(true)
  },
  {
    title: 'Projects',
    link: 'projects',
    icon: 'project',
    customClickHandle: () => Promise.resolve(true)
  },
  {
    title: 'Integrations',
    link: 'integrations',
    icon: 'integration_instructions',
    customClickHandle: () => Promise.resolve(true)
  },
  {
    title: 'Invoices',
    link: 'invoices',
    icon: 'receipt_long',
    customClickHandle: () => Promise.resolve(true)
  },
  {
    title: 'Loyalty',
    link: 'loyalty',
    icon: 'card_giftcard',
    customClickHandle: () => Promise.resolve(true)
  },
  {
    title: 'Offers',
    link: 'offers',
    icon: 'local_offer',
    customClickHandle: () => Promise.resolve(true)
  },
  {
    title: 'Social',
    link: 'social',
    icon: 'share',
    customClickHandle: () => Promise.resolve(true)
  },
  {
    title: 'Onboarding',
    link: 'onboarding',
    icon: 'school',
    customClickHandle: () => Promise.resolve(true)
  },
  {
    title: 'Analytics',
    link: 'analytics',
    icon: 'analytics',
    customClickHandle: () => Promise.resolve(true)
  },
  {
    title: 'Statistics',
    link: 'statistics',
    icon: 'bar_chart',
    isLastInSection: true,
    customClickHandle: () => Promise.resolve(true)
  },
  {
    title: 'Settings',
    link: 'settings',
    icon: 'settings',
    customClickHandle: () => Promise.resolve(true)
  },
  {
    title: 'Help & Support',
    link: 'help',
    icon: 'help_outline',
    customClickHandle: () => Promise.resolve(true)
  },
  {
    title: 'My Profile',
    link: 'profile',
    icon: 'person_outline',
    customClickHandle: () => Promise.resolve(true)
  },
  {
    title: 'Logout',
    link: '',
    icon: 'logout',
    customClickHandle: async () => {
      const authService = inject(AuthService);
      const snackBar = inject(SnackBar);
      const router = inject(Router);
      try {
        await firstValueFrom(authService.logout());
        snackBar.openSuccess('Logged out successfully');
        router.navigate(['/auth/login']);
      } catch (error) {
        console.error('Logout error:', error);
        snackBar.openError('Unable to log out. Please try again.');
      }
    }
  }
]

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
  private authService = inject(AuthService);
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
