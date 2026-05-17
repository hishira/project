import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { RouterLink } from '@angular/router';
import { MainPageViewComponent } from '../../../core/components/main-page-view/main-page-view.component';
import { PageHeaderComponent } from '../../../core/components/page-header/page-header.component';
import { Notification, NotificationPriority, NotificationType } from '../notifications.model';
import { NotificationsService } from '../notifications.service';
import { formatDate, getPriorityColor, getStatusLabel, getTypeIcon } from '../notifications.utils';

@Component({
  selector: 'app-notifications-list',
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
  private readonly notificationsService = inject(NotificationsService);

  readonly notifications = signal<Notification[]>([]);
  readonly filter = signal<'all' | 'unread' | 'read' | 'archived'>('all');

  readonly filteredNotifications = computed(() => {
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

  readonly unreadCount = computed(() =>
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