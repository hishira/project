import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatBadgeModule } from '@angular/material/badge';
import { PageHeaderComponent } from '../../../core/components/page-header/page-header.component';
import { MainPageViewComponent } from '../../../core/components/main-page-view/main-page-view.component';
import { NotificationsService } from '../notifications.service';
import { Notification, NotificationType, NotificationPriority } from '../notifications.model';
import { getTypeIcon, getPriorityColor, getStatusLabel, formatDate } from '../notifications.utils';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-notifications-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatMenuModule,
    MatDividerModule,
    MatBadgeModule,
    PageHeaderComponent,
    MainPageViewComponent
  ],
  templateUrl: './notifications-list.component.html',
  styleUrls: ['./notifications-list.component.scss']
})
export class NotificationsListComponent implements OnInit {
  private notificationsService = inject(NotificationsService);

  notifications = signal<Notification[]>([]);
  filter = signal<'all' | 'unread' | 'read' | 'archived'>('all');

  filteredNotifications = computed(() => {
    const all = this.notifications();
    switch (this.filter()) {
      case 'unread':
        return all.filter(n => n.status === 'unread');
      case 'read':
        return all.filter(n => n.status === 'read');
      case 'archived':
        return all.filter(n => n.status === 'archived');
      default:
        return all;
    }
  });

  unreadCount = computed(() =>
    this.notifications().filter(n => n.status === 'unread').length
  );

  ngOnInit(): void {
    this.notificationsService.getNotifications().subscribe(notifications => {
      this.notifications.set(notifications);
    });
  }

  getTypeIcon(type: NotificationType): string {
    return getTypeIcon(type);
  }

  getPriorityColor(priority: NotificationPriority): string {
    return getPriorityColor(priority);
  }

  getStatusLabel(status: string): string {
    return getStatusLabel(status);
  }

  markAsRead(notification: Notification): void {
    this.notificationsService.markAsRead(notification.id).subscribe();
  }

  markAllAsRead(): void {
    this.notificationsService.markAllAsRead().subscribe();
  }

  archiveNotification(notification: Notification): void {
    this.notificationsService.archiveNotification(notification.id).subscribe();
  }

  setFilter(filter: 'all' | 'unread' | 'read' | 'archived'): void {
    this.filter.set(filter);
  }

  trackById(index: number, notification: Notification): string {
    return notification.id;
  }

  formatDate(dateString: string): string {
    return formatDate(dateString);
  }
}