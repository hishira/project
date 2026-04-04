import { TicketPriority, TicketStatus } from './types';

const priorityIcons: Record<TicketPriority, string> = {
  low: 'arrow_downward',
  medium: 'remove',
  high: 'arrow_upward',
  critical: 'priority_high'
};

const priorityColors: Record<TicketPriority, string> = {
  low: '#2e7d32',
  medium: '#ed6c02',
  high: '#d32f2f',
  critical: '#b71c1c'
};

const statusLabels: Record<TicketStatus, string> = {
  new: 'Nowy',
  in_progress: 'W trakcie',
  waiting_for_customer: 'Oczekuje na klienta',
  resolved: 'Rozwiązany',
  closed: 'Zamknięty',
  todo: 'Do zrobienia',
  doing: 'W realizacji',
  done: 'Zakończone'
};

const statusClasses: Record<TicketStatus, string> = {
  new: 'status-new',
  in_progress: 'status-in-progress',
  waiting_for_customer: 'status-waiting-for-customer',
  resolved: 'status-resolved',
  closed: 'status-closed',
  todo: 'status-todo',
  doing: 'status-doing',
  done: 'status-done'
};

export function getPriorityIcon(priority: TicketPriority): string {
  return priorityIcons[priority] || 'help';
}

export function getPriorityColor(priority: TicketPriority): string {
  return priorityColors[priority];
}

export function getStatusLabel(status: TicketStatus): string {
  return statusLabels[status] || status;
}

export function getStatusClass(status: TicketStatus): string {
  return statusClasses[status] || '';
}

export const allTicketStatuses: TicketStatus[] = [
  'new', 'in_progress', 'waiting_for_customer', 'resolved', 'closed',
  'todo', 'doing', 'done'
];
