import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { Project } from '../../project.model';
import { ProjectNameCellComponent } from '../project-name-cell/project-name-cell.component';
import { ProjectStatusChipComponent } from '../project-status-chip/project-status-chip.component';
import { BudgetCellComponent } from '../budget-cell/budget-cell.component';
import { ProgressCellComponent } from '../progress-cell/progress-cell.component';
import { ProjectActionsComponent } from '../project-actions/project-actions.component';

function calculateProgress(project: Project): number {
  if (!project.tasks || project.tasks.length === 0) return 0;
  const done = project.tasks.filter(t => t.status === 'done').length;
  return Math.round((done / project.tasks.length) * 100);
}

@Component({
  selector: 'app-project-table',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatTooltipModule,
    RouterLink,
    ProjectNameCellComponent,
    ProjectStatusChipComponent,
    BudgetCellComponent,
    ProgressCellComponent,
    ProjectActionsComponent,
  ],
  templateUrl: './project-table.component.html',
  styleUrls: ['./project-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectTableComponent {
  dataSource = input.required<any>(); // MatTableDataSource<Project>
  displayedColumns = input<string[]>(['name', 'client', 'status', 'dates', 'budget', 'progress', 'actions']);

  projectClick = output<Project>();
  viewDetails = output<Project>();
  edit = output<Project>();

  protected calculateProgress = calculateProgress;
}
