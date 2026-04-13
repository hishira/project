import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TaskService } from '../task.service';
import { Task } from '../task.model';
import { getTaskPriorityIcon, getTaskPriorityColor, getTaskStatusLabel } from '../task-status.utils';
import { PageHeaderComponent } from '../../../core/components/page-header/page-header.component';
import { MainPageViewComponent } from '../../../core/components/main-page-view/main-page-view.component';

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
    MatDividerModule,
    DatePipe,
    PageHeaderComponent,
    MainPageViewComponent
  ],
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskDetailComponent {
  private route = inject(ActivatedRoute);
  private taskService = inject(TaskService);
  readonly task = signal<Task | undefined>(undefined);

  readonly getPriorityIcon = getTaskPriorityIcon;
  readonly getPriorityColor = getTaskPriorityColor;
  readonly getStatusLabel = getTaskStatusLabel;

  constructor() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        const found = this.taskService.tasks().find(t => t.id === id);
        this.task.set(found);
      }
    });
  }
}
