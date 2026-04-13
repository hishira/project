import { TaskPriority, TaskStatus } from './task.model';

const taskPriorityIcons: Record<TaskPriority, string> = {
  low: 'arrow_downward',
  medium: 'remove',
  high: 'arrow_upward',
  critical: 'priority_high'
};

const taskPriorityColors: Record<TaskPriority, string> = {
  low: '#2e7d32',
  medium: '#ed6c02',
  high: '#d32f2f',
  critical: '#b71c1c'
};

const taskStatusLabels: Record<TaskStatus, string> = {
  todo: 'Do zrobienia',
  in_progress: 'W trakcie',
  done: 'Zakończone',
  cancelled: 'Anulowane'
};

export function getTaskPriorityIcon(priority: TaskPriority): string {
  return taskPriorityIcons[priority] || 'help';
}

export function getTaskPriorityColor(priority: TaskPriority): string {
  return taskPriorityColors[priority];
}

export function getTaskStatusLabel(status: TaskStatus): string {
  return taskStatusLabels[status] || status;
}
