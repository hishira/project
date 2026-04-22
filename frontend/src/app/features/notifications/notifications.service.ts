import { Injectable, inject, signal } from '@angular/core';
import { BehaviorSubject, Observable, timer, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import {
  Notification,
  NotificationConfig,
  CreateNotificationRequest,
  NotificationStats,
  NotificationType,
  NotificationPriority,
  NotificationCategory,
  NotificationStatus
} from './notifications.model';
import { SAMPLE_NOTIFICATION_TITLES, SAMPLE_NOTIFICATION_MESSAGES, NOTIFICATION_TYPES, NOTIFICATION_PRIORITIES, NOTIFICATION_CATEGORIES_KEYS } from './notifications.constants';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  private notifications = signal<Notification[]>([]);
  private config = signal<NotificationConfig | null>(null);

  // Real-time notifications stream (simulated WebSocket)
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  public notifications$ = this.notificationsSubject.asObservable();

  // WebSocket connection status
  private wsConnectedSubject = new BehaviorSubject<boolean>(false);
  public wsConnected$ = this.wsConnectedSubject.asObservable();

  constructor() {
    this.initializeSampleData();
    this.initializeWebSocketSimulation();
  }

  private initializeSampleData(): void {
    const sampleNotifications: Notification[] = [
      {
        id: '1',
        title: 'Witamy w systemie!',
        message: 'Twoje konto zostało pomyślnie skonfigurowane. Możesz teraz korzystać ze wszystkich funkcji.',
        type: 'success',
        priority: 'medium',
        status: 'read',
        createdAt: '2024-01-15T10:30:00Z',
        readAt: '2024-01-15T10:35:00Z',
        userId: 'current-user',
        category: 'system'
      },
      {
        id: '2',
        title: 'Aktualizacja projektu',
        message: 'Projekt "CRM System" został zaktualizowany przez użytkownika admin@example.com',
        type: 'info',
        priority: 'low',
        status: 'unread',
        createdAt: '2024-01-15T14:20:00Z',
        userId: 'current-user',
        category: 'project_changes'
      },
      {
        id: '3',
        title: 'Pilne: Bezpieczeństwo konta',
        message: 'Wykryto podejrzane logowanie z nowego urządzenia. Jeśli to nie Ty, zmień hasło natychmiast.',
        type: 'error',
        priority: 'urgent',
        status: 'unread',
        createdAt: '2024-01-15T16:45:00Z',
        userId: 'current-user',
        category: 'security'
      },
      {
        id: '4',
        title: 'Nowe zadanie przypisane',
        message: 'Zadanie "Implementacja powiadomień" zostało Ci przypisane przez kierownika projektu.',
        type: 'warning',
        priority: 'high',
        status: 'unread',
        createdAt: '2024-01-16T09:15:00Z',
        userId: 'current-user',
        category: 'task_updates'
      },
      {
        id: '5',
        title: 'Raport miesięczny gotowy',
        message: 'Raport statystyk za styczeń 2024 jest dostępny do pobrania.',
        type: 'info',
        priority: 'medium',
        status: 'unread',
        createdAt: '2024-01-16T12:00:00Z',
        userId: 'current-user',
        category: 'billing'
      }
    ];

    this.notifications.set(sampleNotifications);
    this.notificationsSubject.next(sampleNotifications);

    // Sample config
    const sampleConfig: NotificationConfig = {
      id: 'config-1',
      userId: 'current-user',
      emailEnabled: true,
      smsEnabled: false,
      pushEnabled: true,
      webSocketEnabled: true,
      categories: [
        { category: 'system', channels: { email: true, sms: false, push: true, webSocket: true } },
        { category: 'security', channels: { email: true, sms: true, push: true, webSocket: true } },
        { category: 'task_updates', channels: { email: true, sms: false, push: true, webSocket: true } },
        { category: 'project_changes', channels: { email: false, sms: false, push: true, webSocket: true } },
        { category: 'billing', channels: { email: true, sms: false, push: false, webSocket: true } }
      ],
      quietHours: {
        enabled: true,
        start: '22:00',
        end: '08:00'
      }
    };

    this.config.set(sampleConfig);
  }

  private initializeWebSocketSimulation(): void {
    // Simulate WebSocket connection
    setTimeout(() => {
      this.wsConnectedSubject.next(true);
      console.log('WebSocket połączony - symulacja powiadomień w czasie rzeczywistym');
    }, 1000);

    // Simulate receiving new notifications every 30-60 seconds
    timer(30000, 45000).pipe(
      map(() => this.generateRandomNotification()),
      tap(notification => {
        const current = this.notifications();
        this.notifications.set([notification, ...current]);
        this.notificationsSubject.next(this.notifications());
        console.log('Nowe powiadomienie:', notification.title);
      })
    ).subscribe();
  }

  private generateRandomNotification(): Notification {

    const titles = SAMPLE_NOTIFICATION_TITLES;

    const messages = SAMPLE_NOTIFICATION_MESSAGES;

    const types = NOTIFICATION_TYPES;
    const priorities = NOTIFICATION_PRIORITIES;
    const categories = NOTIFICATION_CATEGORIES_KEYS;

    return {
      id: Date.now().toString(),
      title: titles[Math.floor(Math.random() * titles.length)],
      message: messages[Math.floor(Math.random() * messages.length)],
      type: types[Math.floor(Math.random() * types.length)],
      priority: priorities[Math.floor(Math.random() * priorities.length)],
      status: 'unread',
      createdAt: new Date().toISOString(),
      userId: 'current-user',
      category: categories[Math.floor(Math.random() * categories.length)]
    };
  }

  // Public API methods
  getNotifications(): Observable<Notification[]> {
    return this.notifications$;
  }

  getNotificationById(id: string): Observable<Notification | null> {
    return this.notifications$.pipe(
      map(notifications => notifications.find(n => n.id === id) || null)
    );
  }

  markAsRead(id: string): Observable<boolean> {
    const current = this.notifications();
    const updated = current.map(n =>
      n.id === id ? { ...n, status: 'read' as NotificationStatus, readAt: new Date().toISOString() } : n
    );
    this.notifications.set(updated);
    this.notificationsSubject.next(updated);
    return of(true); // Simulate success
  }

  markAllAsRead(): Observable<boolean> {
    const current = this.notifications();
    const updated = current.map(n => ({
      ...n,
      status: 'read' as NotificationStatus,
      readAt: n.readAt || new Date().toISOString()
    }));
    this.notifications.set(updated);
    this.notificationsSubject.next(updated);
    return of(true); // Simulate success
  }

  archiveNotification(id: string): Observable<boolean> {
    const current = this.notifications();
    const updated = current.map(n =>
      n.id === id ? { ...n, status: 'archived' as NotificationStatus } : n
    );
    this.notifications.set(updated);
    this.notificationsSubject.next(updated);
    return of(true); // Simulate success
  }

  createNotification(request: CreateNotificationRequest): Observable<Notification> {
    const newNotification: Notification = {
      id: Date.now().toString(),
      title: request.title,
      message: request.message,
      type: request.type,
      priority: request.priority,
      status: 'unread',
      createdAt: new Date().toISOString(),
      userId: request.userId || 'current-user',
      category: request.category,
      metadata: request.metadata
    };

    const current = this.notifications();
    this.notifications.set([newNotification, ...current]);
    this.notificationsSubject.next(this.notifications());

    return of(newNotification); // Simulate success
  }

  getConfig(): Observable<NotificationConfig | null> {
    return of(this.config());
  }

  updateConfig(config: NotificationConfig): Observable<NotificationConfig> {
    this.config.set(config);
    return of(config); // Simulate success
  }

  getStats(): Observable<NotificationStats> {
    const notifications = this.notifications();
    const stats: NotificationStats = {
      total: notifications.length,
      unread: notifications.filter(n => n.status === 'unread').length,
      byType: {} as Record<NotificationType, number>,
      byPriority: {} as Record<NotificationPriority, number>,
      byCategory: {} as Record<NotificationCategory, number>
    };

    // Count by type
    notifications.forEach(n => {
      stats.byType[n.type] = (stats.byType[n.type] || 0) + 1;
    });

    // Count by priority
    notifications.forEach(n => {
      stats.byPriority[n.priority] = (stats.byPriority[n.priority] || 0) + 1;
    });

    // Count by category
    notifications.forEach(n => {
      stats.byCategory[n.category] = (stats.byCategory[n.category] || 0) + 1;
    });

    return of(stats);
  }

  // WebSocket simulation methods
  connectWebSocket(): void {
    if (!this.wsConnectedSubject.value) {
      this.wsConnectedSubject.next(true);
      console.log('WebSocket połączony');
    }
  }

  disconnectWebSocket(): void {
    this.wsConnectedSubject.next(false);
    console.log('WebSocket rozłączony');
  }

  isWebSocketConnected(): boolean {
    return this.wsConnectedSubject.value;
  }
}