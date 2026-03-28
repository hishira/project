import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ProjectStatus } from '../../project.model';
import { ProjectStatusChipComponent } from '../project-status-chip/project-status-chip.component';

@Component({
  selector: 'app-project-summary',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatProgressBarModule, ProjectStatusChipComponent],
  templateUrl: './project-summary.component.html',
  styleUrls: ['./project-summary.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectSummaryComponent {
  name = input.required<string>();
  status = input.required<ProjectStatus>();
  clientName = input.required<string>();
  startDate = input.required<Date>();
  endDate = input<Date | undefined>();
  budgetSpent = input.required<number>();
  budgetTotal = input.required<number>();
  budgetCurrency = input.required<string>();
  progress = input.required<number>();
  description = input<string | undefined>(undefined);

  get budgetPercent(): number {
    return (this.budgetSpent() / this.budgetTotal()) * 100;
  }
}
