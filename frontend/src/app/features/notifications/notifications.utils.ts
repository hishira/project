import { NotificationType, NotificationPriority } from './notifications.model';
import { NOTIFICATION_TYPE_ICONS, NOTIFICATION_PRIORITY_COLORS, NOTIFICATION_TYPE_LABELS, NOTIFICATION_PRIORITY_LABELS, NOTIFICATION_STATUS_LABELS } from './notifications.constants';

/**
 * Get the icon name for a notification type
 */
export function getTypeIcon(type: NotificationType): string {
  return NOTIFICATION_TYPE_ICONS[type] || 'info';
}

/**
 * Get the color for a notification priority
 */
export function getPriorityColor(priority: NotificationPriority): string {
  return NOTIFICATION_PRIORITY_COLORS[priority] || '#666';
}

/**
 * Get the label for a notification type
 */
export function getTypeLabel(type: NotificationType): string {
  return NOTIFICATION_TYPE_LABELS[type] || 'Informacja';
}

/**
 * Get the label for a notification priority
 */
export function getPriorityLabel(priority: NotificationPriority): string {
  return NOTIFICATION_PRIORITY_LABELS[priority] || 'Nieznany';
}

/**
 * Get the label for a notification status
 */
export function getStatusLabel(status: string): string {
  return NOTIFICATION_STATUS_LABELS[status] || status;
}

/**
 * Format a category string to title case
 */
export function getCategoryLabel(category: string): string {
  return category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
}

/**
 * Format a date string to Polish locale (compact format for lists)
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString('pl-PL', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Format a date string to Polish locale (detailed format for details view)
 */
export function formatDateDetailed(dateString: string): string {
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