export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  priority: NotificationPriority;
  status: NotificationStatus;
  createdAt: string;
  readAt?: string;
  userId: string;
  category: NotificationCategory;
  metadata?: Record<string, any>;
}

export interface NotificationConfig {
  id: string;
  userId: string;
  emailEnabled: boolean;
  smsEnabled: boolean;
  pushEnabled: boolean;
  webSocketEnabled: boolean;
  categories: NotificationCategoryConfig[];
  quietHours: {
    enabled: boolean;
    start: string; // HH:mm format
    end: string; // HH:mm format
  };
}

export interface NotificationChannelConfig extends Record<NotificationChannel, boolean> {}

export interface NotificationCategoryConfig {
  category: NotificationCategory;
  channels: NotificationChannelConfig;
}

export type NotificationType = 'info' | 'success' | 'warning' | 'error' | 'system';

export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent';

export type NotificationStatus = 'unread' | 'read' | 'archived';

export type NotificationChannel = 'email' | 'sms' | 'push' | 'webSocket';

export type NotificationCategory =
  | 'system'
  | 'user_activity'
  | 'task_updates'
  | 'project_changes'
  | 'security'
  | 'billing'
  | 'support'
  | 'marketing';

export interface CreateNotificationRequest {
  title: string;
  message: string;
  type: NotificationType;
  priority: NotificationPriority;
  category: NotificationCategory;
  userId?: string; // If not provided, send to current user
  metadata?: Record<string, any>;
}

export interface NotificationStats {
  total: number;
  unread: number;
  byType: Record<NotificationType, number>;
  byPriority: Record<NotificationPriority, number>;
  byCategory: Record<NotificationCategory, number>;
}