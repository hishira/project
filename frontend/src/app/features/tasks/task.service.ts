import { Injectable, resource, signal, ResourceRef, inject } from '@angular/core';
import { Task, CalendarEvent, TaskStatus, TaskPriority } from './task.model';
import { Resource } from '../../shared/resources/resource';



@Injectable({ providedIn: 'root' })
export class TaskService {
  private readonly tasksData: ResourceRef<Task[]> = inject(Resource<Task[]>).resource;
  readonly tasks = this.tasksData.value;

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
        end: t.type === 'meeting' && t.dueDate ? new Date(t.dueDate.getTime() + 60 * 60 * 1000) : undefined, // zakładamy 1h spotkania
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