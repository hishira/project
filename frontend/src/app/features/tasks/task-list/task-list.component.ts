import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { MainPageViewComponent } from '../../../core/components/main-page-view/main-page-view.component';
import { PageHeaderComponent } from '../../../core/components/page-header/page-header.component';
import { Task, TaskStatus } from '../task.model';
import { TaskService } from '../task.service';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatTooltipModule,
    MatTabsModule,
    MatCheckboxModule,
    PageHeaderComponent,
    MainPageViewComponent
  ],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent {
  private taskService = inject(TaskService);
  tasks = this.taskService.tasks;
  now = new Date();

  // Filtry widoku
  activeFilter: 'my' | 'team' | 'done' = 'my';
  currentUserId = 'u1'; // symulacja zalogowanego użytkownika

  get filteredTasks(): Task[] {
    const all = this.tasks();
    switch (this.activeFilter) {
      case 'my':
        return all.filter(t => t.assignedTo?.id === this.currentUserId && t.status !== 'done');
      case 'team':
        return all.filter(t => t.assignedTo?.id !== this.currentUserId && t.status !== 'done');
      case 'done':
        return all.filter(t => t.status === 'done');
      default:
        return all;
    }
  }

  getPriorityIcon(priority: string): string {
    const icons: Record<string, string> = {
      low: 'arrow_downward',
      medium: 'remove',
      high: 'arrow_upward',
      critical: 'priority_high'
    };
    return icons[priority] || 'help';
  }

  getPriorityColor(priority: string): string {
    const colors: Record<string, string> = {
      low: '#2e7d32',
      medium: '#ed6c02',
      high: '#d32f2f',
      critical: '#b71c1c'
    };
    return colors[priority];
  }

  getStatusClass(status: TaskStatus): string {
    const map: Record<TaskStatus, string> = {
      todo: 'status-todo',
      in_progress: 'status-progress',
      done: 'status-done',
      cancelled: 'status-cancelled'
    };
    return map[status] || '';
  }

  getTypeIcon(type: string): string {
    const icons: Record<string, string> = {
      task: 'assignment',
      meeting: 'event',
      note: 'note'
    };
    return icons[type] || 'task';
  }

  onAdd() {
    console.log('Dodaj nowe zadanie');
  }

  onToggleDone(task: Task, event: any) {
    event.stopPropagation();
    console.log('Oznacz jako wykonane:', task.id);
  }

  onEdit(task: Task, event: MouseEvent) {
    event.stopPropagation();
    console.log('Edytuj zadanie:', task.id);
  }
}