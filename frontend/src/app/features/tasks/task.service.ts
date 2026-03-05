import { Injectable, signal } from '@angular/core';
import { Task, CalendarEvent, TaskStatus, TaskPriority } from './task.model';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private readonly tasksData: Task[] = [
    {
      id: 't1',
      title: 'Przygotowanie oferty dla Tymbark',
      description: 'Nowa umowa na dostawę soków bio – przygotować kosztorys i warunki.',
      type: 'task',
      status: 'in_progress',
      priority: 'high',
      createdAt: new Date('2025-03-01T09:00'),
      updatedAt: new Date('2025-03-03T11:30'),
      dueDate: new Date('2025-03-10T17:00'),
      assignedTo: { id: 'u1', fullName: 'Jan Kowalski', avatarUrl: 'https://i.pravatar.cc/40?u=1' },
      createdBy: { id: 'u2', fullName: 'Anna Nowak' },
      relatedTo: { type: 'client', id: 'c1', name: 'Tymbark Sp. z o.o.' },
      reminder: new Date('2025-03-09T08:00')
    },
    {
      id: 't2',
      title: 'Spotkanie z Capri-Sun',
      description: 'Omówienie nowej linii produktów.',
      type: 'meeting',
      status: 'todo',
      priority: 'medium',
      createdAt: new Date('2025-03-02T14:00'),
      updatedAt: new Date('2025-03-02T14:00'),
      dueDate: new Date('2025-03-15T11:00'),
      assignedTo: { id: 'u1', fullName: 'Jan Kowalski' },
      createdBy: { id: 'u1', fullName: 'Jan Kowalski' },
      relatedTo: { type: 'client', id: 'c2', name: 'Capri-Sun Polska' },
      location: 'Warszawa, ul. Przemysłowa 10',
      allDay: false,
      reminder: new Date('2025-03-15T09:00')
    },
    {
      id: 't3',
      title: 'Analiza reklamacji Pepsi',
      description: 'Sprawdzić partię soków, przygotować raport.',
      type: 'task',
      status: 'todo',
      priority: 'critical',
      createdAt: new Date('2025-03-03T08:30'),
      updatedAt: new Date('2025-03-03T08:30'),
      dueDate: new Date('2025-03-07T12:00'),
      assignedTo: { id: 'u3', fullName: 'Piotr Wiśniewski' },
      createdBy: { id: 'u2', fullName: 'Anna Nowak' },
      relatedTo: { type: 'ticket', id: 'tkt45', name: 'Reklamacja 45/2025' },
      reminder: new Date('2025-03-06T08:00')
    },
    {
      id: 't4',
      title: 'Aktualizacja dokumentacji produktu',
      description: 'Dodać nowe specyfikacje do bazy wiedzy.',
      type: 'task',
      status: 'done',
      priority: 'low',
      createdAt: new Date('2025-02-25T10:00'),
      updatedAt: new Date('2025-03-01T15:20'),
      dueDate: new Date('2025-02-28T18:00'),
      completedAt: new Date('2025-03-01T15:20'),
      assignedTo: { id: 'u4', fullName: 'Magdalena Zając' },
      createdBy: { id: 'u1', fullName: 'Jan Kowalski' },
      relatedTo: { type: 'client', id: 'c3', name: 'PepsiCo Polska' }
    },
    {
      id: 't5',
      title: 'Webinar o nowym CRM',
      description: 'Prezentacja dla zespołu sprzedaży.',
      type: 'meeting',
      status: 'todo',
      priority: 'medium',
      createdAt: new Date('2025-03-04T09:00'),
      updatedAt: new Date('2025-03-04T09:00'),
      dueDate: new Date('2025-03-20T14:00'),
      assignedTo: { id: 'u1', fullName: 'Jan Kowalski' },
      createdBy: { id: 'u5', fullName: 'Tomasz Nowicki' },
      allDay: false,
      location: 'Online – Teams',
      reminder: new Date('2025-03-20T13:00')
    },
    {
      id: 't6',
      title: 'Notatka po rozmowie z Coca-Cola',
      description: 'Ustalenia: chcą przedłużyć umowę, potrzebują nowych warunków cenowych.',
      type: 'note',
      status: 'done',
      priority: 'medium',
      createdAt: new Date('2025-03-02T16:30'),
      updatedAt: new Date('2025-03-02T16:30'),
      dueDate: undefined,
      assignedTo: undefined,
      createdBy: { id: 'u1', fullName: 'Jan Kowalski' },
      relatedTo: { type: 'client', id: 'c4', name: 'Coca-Cola HBC Polska' }
    }
  ];

  readonly tasks = signal<Task[]>(this.tasksData);

  getTasksByStatus(status: TaskStatus): Task[] {
    return this.tasks().filter(t => t.status === status);
  }

  getTasksByAssignee(userId: string): Task[] {
    return this.tasks().filter(t => t.assignedTo?.id === userId);
  }

  getTasksForCalendar(start: Date, end: Date): CalendarEvent[] {
    // Konwersja zadań na wydarzenia kalendarza
    return this.tasks()
      .filter(t => t.dueDate || t.type === 'meeting') // tylko te z datą
      .map(t => ({
        id: t.id,
        title: t.title,
        start: t.dueDate || t.createdAt,
        end: t.type === 'meeting' && t.dueDate ? new Date(t.dueDate.getTime() + 60*60*1000) : undefined, // zakładamy 1h spotkania
        allDay: t.allDay,
        color: this.getPriorityColor(t.priority),
        task: t
      }));
  }

  private getPriorityColor(priority: TaskPriority): string {
    const colors: Record<TaskPriority, string> = {
      low: '#2e7d32',
      medium: '#ed6c02',
      high: '#d32f2f',
      critical: '#b71c1c'
    };
    return colors[priority];
  }

  // Symulacja akcji
  addTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) {
    console.log('Dodawanie zadania:', task);
  }

  updateTask(id: string, changes: Partial<Task>) {
    console.log('Aktualizacja zadania:', id, changes);
  }

  deleteTask(id: string) {
    console.log('Usuwanie zadania:', id);
  }
}