import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MainPageViewComponent } from '../../../core/components/main-page-view/main-page-view.component';
import { PageHeaderComponent } from '../../../core/components/page-header/page-header.component';
import { Notification, NotificationPriority, NotificationType } from '../notifications.model';
import { NotificationsService } from '../notifications.service';
import { formatDateDetailed, getCategoryLabel, getPriorityColor, getPriorityLabel, getTypeIcon, getTypeLabel } from '../notifications.utils';

@Component({
  selector: 'app-notifications-detail',
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

  readonly notification = signal<Notification | null>(null);
  private readonly subscription = new Subscription();
  readonly Object = Object; // Expose Object to template

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