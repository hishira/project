import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Project } from '../project.model';
import { ProjectService } from '../project.service';
import { ProjectSummaryComponent } from './project-summary/project-summary.component';
import { TeamListComponent } from './team-list/team-list.component';
import { TasksTableComponent } from './tasks-table/tasks-table.component';
import { MilestonesListComponent } from './milestones-list/milestones-list.component';
import { BudgetTableComponent } from './budget-table/budget-table.component';
import { MainPageViewComponent } from '../../../core/components/main-page-view/main-page-view.component';
import { PageHeaderComponent } from '../../../core/components/page-header/page-header.component';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    MatTabsModule,
    ProjectSummaryComponent,
    TeamListComponent,
    TasksTableComponent,
    MilestonesListComponent,
    BudgetTableComponent,
    MainPageViewComponent,
    PageHeaderComponent,
  ],
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly projectService = inject(ProjectService);

  readonly project = signal<Project | undefined>(undefined);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const found = this.projectService.getProjectById(id);
      this.project.set(found);
    }
  }

  calculateProgress(project: Project): number {
    if (!project.tasks || project.tasks.length === 0) return 0;
    const done = project.tasks.filter(t => t.status === 'done').length;
    return Math.round((done / project.tasks.length) * 100);
  }

  onAddTask() {
    console.log('Dodaj nowe zadanie do projektu:', this.project()?.id);
  }

  onEditTask(taskId: string) {
    console.log('Edytuj zadanie:', taskId);
  }

  onAddMilestone() {
    console.log('Dodaj kamień milowy');
  }

  onGenerateReport() {
    console.log('Generuj raport postępu dla projektu:', this.project()?.id);
  }
}