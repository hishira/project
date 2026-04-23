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
import { getTypeIcon, getPriorityColor, getTypeLabel, getPriorityLabel, getCategoryLabel, formatDateDetailed } from '../notifications.utils';
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
    return getTypeIcon(type);
  }

  getPriorityColor(priority: NotificationPriority): string {
    return getPriorityColor(priority);
  }

  getTypeLabel(type: NotificationType): string {
    return getTypeLabel(type);
  }

  getPriorityLabel(priority: NotificationPriority): string {
    return getPriorityLabel(priority);
  }

  getCategoryLabel(category: string): string {
    return getCategoryLabel(category);
  }

  formatDate(dateString: string): string {
    return formatDateDetailed(dateString);
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