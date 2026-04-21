import { NotificationType, NotificationPriority, NotificationCategory } from './notifications.model';

export const NOTIFICATION_CATEGORIES: { key: NotificationCategory; label: string }[] = [
  { key: 'system', label: 'System' },
  { key: 'user_activity', label: 'Aktywność użytkownika' },
  { key: 'task_updates', label: 'Aktualizacje zadań' },
  { key: 'project_changes', label: 'Zmiany w projektach' },
  { key: 'security', label: 'Bezpieczeństwo' },
  { key: 'billing', label: 'Rozliczenia' },
  { key: 'support', label: 'Wsparcie' },
  { key: 'marketing', label: 'Marketing' }
];

export const NOTIFICATION_TYPE_ICONS: Record<NotificationType, string> = {
  success: 'check_circle',
  warning: 'warning',
  error: 'error',
  system: 'settings',
  info: 'info'
};

export const NOTIFICATION_PRIORITY_COLORS: Record<NotificationPriority, string> = {
  urgent: '#d32f2f',
  high: '#f57c00',
  medium: '#1976d2',
  low: '#388e3c'
};

export const NOTIFICATION_TYPE_LABELS: Record<NotificationType, string> = {
  success: 'Sukces',
  warning: 'Ostrzeżenie',
  error: 'Błąd',
  system: 'System',
  info: 'Informacja'
};

export const NOTIFICATION_PRIORITY_LABELS: Record<NotificationPriority, string> = {
  urgent: 'Pilne',
  high: 'Wysoki',
  medium: 'Średni',
  low: 'Niski'
};

export const NOTIFICATION_STATUS_LABELS: Record<string, string> = {
  unread: 'Nieprzeczytane',
  read: 'Przeczytane',
  archived: 'Zarchiwizowane'
};

export const SAMPLE_NOTIFICATION_TITLES = [
  'Aktualizacja systemu',
  'Nowe zadanie',
  'Zmiana statusu projektu',
  'Powiadomienie bezpieczeństwa',
  'Raport gotowy',
  'Przypomnienie o spotkaniu'
];

export const SAMPLE_NOTIFICATION_MESSAGES = [
  'W systemie zostały wprowadzone ważne aktualizacje.',
  'Zostało Ci przypisane nowe zadanie do wykonania.',
  'Status projektu uległ zmianie - sprawdź szczegóły.',
  'Wykryto aktywność związaną z bezpieczeństwem konta.',
  'Nowy raport jest dostępny w systemie.',
  'Przypominamy o zaplanowanym spotkaniu.'
];

export const NOTIFICATION_TYPES: NotificationType[] = ['info', 'success', 'warning', 'error'];

export const NOTIFICATION_PRIORITIES: NotificationPriority[] = ['low', 'medium', 'high', 'urgent'];

export const NOTIFICATION_CATEGORIES_KEYS: NotificationCategory[] = ['system', 'task_updates', 'project_changes', 'security', 'billing'];
