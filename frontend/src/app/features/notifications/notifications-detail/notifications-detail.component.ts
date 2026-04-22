import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { PageHeaderComponent } from '../../../core/components/page-header/page-header.component';
import { MainPageViewComponent } from '../../../core/components/main-page-view/main-page-view.component';
import { NotificationsService } from '../notifications.service';
import { Notification, NotificationType, NotificationPriority } from '../notifications.model';
import { NOTIFICATION_TYPE_ICONS, NOTIFICATION_PRIORITY_COLORS, NOTIFICATION_TYPE_LABELS, NOTIFICATION_PRIORITY_LABELS } from '../notifications.constants';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-notifications-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
    PageHeaderComponent,
    MainPageViewComponent
  ],
  templateUrl: './notifications-detail.component.html',
  styleUrls: ['./notifications-detail.component.scss']
})
export class NotificationsDetailComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private notificationsService = inject(NotificationsService);

  notification = signal<Notification | null>(null);
  private subscription = new Subscription();
  Object = Object; // Expose Object to template

  ngOnInit(): void {
    this.subscription.add(
      this.route.paramMap.subscribe(params => {
        const id = params.get('id');
        if (id) {
          this.loadNotification(id);
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private loadNotification(id: string): void {
    this.notificationsService.getNotificationById(id).subscribe(notification => {
      this.notification.set(notification);
      // Auto-mark as read when viewing details
      if (notification && notification.status === 'unread') {
        this.notificationsService.markAsRead(id).subscribe();
      }
    });
  }

  getTypeIcon(type: NotificationType): string {
    return NOTIFICATION_TYPE_ICONS[type] || 'info';
  }

  getPriorityColor(priority: NotificationPriority): string {
    return NOTIFICATION_PRIORITY_COLORS[priority] || '#666';
  }

  getTypeLabel(type: NotificationType): string {
    return NOTIFICATION_TYPE_LABELS[type] || 'Informacja';
  }

  getPriorityLabel(priority: NotificationPriority): string {
    return NOTIFICATION_PRIORITY_LABELS[priority] || 'Nieznany';
  }

  getCategoryLabel(category: string): string {
    return category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString('pl-PL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }

  archiveNotification(): void {
    const notification = this.notification();
    if (notification) {
      this.notificationsService.archiveNotification(notification.id).subscribe(() => {
        this.router.navigate(['/notifications/list']);
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/notifications/list']);
  }
}