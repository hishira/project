import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ProjectTask } from '../../project.model';

@Component({
  selector: 'app-tasks-table',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTableModule, MatChipsModule, MatIconModule, MatButtonModule, MatTooltipModule],
  templateUrl: './tasks-table.component.html',
  styleUrls: ['./tasks-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TasksTableComponent {
  tasks = input.required<ProjectTask[]>();
  addTask = output<void>();
  editTask = output<string>();

  displayedColumns: string[] = ['title', 'assignee', 'status', 'hours', 'dueDate', 'actions'];

  getStatusLabel(status: ProjectTask['status']): string {
    const map: Record<ProjectTask['status'], string> = {
      todo: 'Do zrobienia',
      in_progress: 'W trakcie',
      done: 'Zrobione'
    };
    return map[status];
  }

  getStatusClass(status: ProjectTask['status']): string {
    return `task-status-${status}`;
  }
}
