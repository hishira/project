import { CommonModule, DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule, MatCheckboxChange } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { MainPageViewComponent } from '../../../core/components/main-page-view/main-page-view.component';
import { PageHeaderComponent } from '../../../core/components/page-header/page-header.component';
import { Task, TaskType } from '../task.model';
import { TaskService } from '../task.service';
import { getTaskPriorityIcon, getTaskPriorityColor, getTaskStatusLabel } from '../task-status.utils';

const taskTypeIcons: Record<TaskType, string> = {
  task: 'assignment',
  meeting: 'event',
  note: 'note'
};

function getTaskTypeIcon(type: TaskType): string {
  return taskTypeIcons[type] || 'task';
}

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
    DatePipe,
    PageHeaderComponent,
    MainPageViewComponent
  ],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent {
  private taskService = inject(TaskService);
  readonly tasks = this.taskService.tasks;
  readonly now = new Date();

  // Filtry widoku
  readonly activeFilter = signal<'my' | 'team' | 'done'>('my');
  readonly currentUserId = 'u1'; // symulacja zalogowanego użytkownika

  readonly filteredTasks = computed(() => {
    const all = this.tasks();
    const filter = this.activeFilter();
    switch (filter) {
      case 'my':
        return all.filter(t => t.assignedTo?.id === this.currentUserId && t.status !== 'done');
      case 'team':
        return all.filter(t => t.assignedTo?.id !== this.currentUserId && t.status !== 'done');
      case 'done':
        return all.filter(t => t.status === 'done');
      default:
        return all;
    }
  });

  readonly getPriorityIcon = getTaskPriorityIcon;
  readonly getPriorityColor = getTaskPriorityColor;
  readonly getStatusLabel = getTaskStatusLabel;
  readonly getTypeIcon = getTaskTypeIcon;

  onCategoryChange(event: any): void {
    const index = event.index;
    const filters: Array<'my' | 'team' | 'done'> = ['my', 'team', 'done'];
    if (index >= 0 && index < filters.length) {
      this.activeFilter.set(filters[index]);
    }
  }

  onAdd(): void {
    console.log('Dodaj nowe zadanie');
  }

  onToggleDone(task: Task, event: MatCheckboxChange): void {
    console.log('Oznacz jako wykonane:', task.id);
  }

  onEdit(task: Task, event: MouseEvent): void {
    event.stopPropagation();
    console.log('Edytuj zadanie:', task.id);
  }
}
