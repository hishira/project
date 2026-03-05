import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { TaskService } from '../task.service';
import { Task } from '../task.model';

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatDividerModule
  ],
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.scss']
})
export class TaskDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private taskService = inject(TaskService);
  task = signal<Task | undefined>(undefined);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const found = this.taskService.tasks().find(t => t.id === id);
      this.task.set(found);
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

  getStatusLabel(status: string): string {
    const map: Record<string, string> = {
      todo: 'Do zrobienia',
      in_progress: 'W trakcie',
      done: 'Zakończone',
      cancelled: 'Anulowane'
    };
    return map[status] || status;
  }

  onEdit() {
    console.log('Edytuj zadanie:', this.task()?.id);
  }

  onDelete() {
    console.log('Usuń zadanie:', this.task()?.id);
  }
}