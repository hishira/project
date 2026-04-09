import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatListModule } from '@angular/material/list';
import { OnboardingTask } from '../../onboarding.model';

@Component({
  selector: 'app-onboarding-tasks-tab',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatCheckboxModule, MatListModule],
  template: `
    <div class="tab-content">
      <mat-card class="inner-card">
        <mat-card-header>
          <mat-card-title>Lista zadań onboardingowych</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <mat-list>
            @for (task of tasks(); track task.id) {
              <mat-list-item class="task-item">
                <div class="task-row">
                  <mat-checkbox [checked]="task.status === 'completed'" (change)="onToggleTask(task)">
                  </mat-checkbox>
                  <div class="task-info">
                    <span class="task-title">{{ task.title }}</span>
                    @if (task.description) {
                      <span class="task-desc">{{ task.description }}</span>
                    }
                  </div>
                  @if (task.completedAt) {
                    <span class="task-completed">✓ {{ task.completedAt | date: 'dd MMM' }}</span>
                  } @else {
                    <span class="task-pending">Oczekuje</span>
                  }
                </div>
              </mat-list-item>
            }
          </mat-list>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .tab-content { padding: 24px 0; }
    .inner-card .mat-mdc-card-header { padding: 16px 16px 0; }
    .task-item { height: auto !important; padding: 12px 0; }
    .task-row {
      display: flex;
      align-items: center;
      width: 100%;
      gap: 16px;
      .task-info {
        flex: 1;
        display: flex;
        flex-direction: column;
        .task-title { font-weight: 500; color: #0f172a; }
        .task-desc { font-size: 0.8rem; color: #64748b; }
      }
      .task-completed { color: #2e7d32; font-size: 0.85rem; }
      .task-pending { color: #ed6c02; font-size: 0.85rem; }
    }
  `]
})
export class OnboardingTasksTabComponent {
  tasks = input.required<OnboardingTask[]>();
  toggleTask = output<OnboardingTask>();

  onToggleTask(task: OnboardingTask) {
    this.toggleTask.emit(task);
  }
}
