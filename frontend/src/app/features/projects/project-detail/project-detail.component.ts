import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ProjectService } from '../project.service';
import { Project } from '../project.model';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatDividerModule,
    MatTabsModule,
    MatTableModule,
    MatListModule,
    MatProgressBarModule
  ],
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.scss']
})
export class ProjectDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private projectService = inject(ProjectService);
  project = signal<Project | undefined>(undefined);

  // Kolumny dla tabeli zadań
  taskColumns: string[] = ['title', 'assignee', 'status', 'hours', 'dueDate', 'actions'];
  // Kolumny dla budżetu
  budgetColumns: string[] = ['name', 'planned', 'actual', 'variance'];

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const found = this.projectService.getProjectById(id);
      this.project.set(found);
    }
  }

  getStatusClass(status: string): string {
    const map: Record<string, string> = {
      planned: 'status-planned',
      active: 'status-active',
      on_hold: 'status-on-hold',
      completed: 'status-completed',
      cancelled: 'status-cancelled'
    };
    return map[status] || '';
  }

  getStatusLabel(status: string): string {
    const map: Record<string, string> = {
      planned: 'Planowany',
      active: 'Aktywny',
      on_hold: 'Wstrzymany',
      completed: 'Zakończony',
      cancelled: 'Anulowany'
    };
    return map[status] || status;
  }

  calculateProgress(project: Project): number {
    if (!project.tasks || project.tasks.length === 0) return 0;
    const done = project.tasks.filter(t => t.status === 'done').length;
    return Math.round((done / project.tasks.length) * 100);
  }

  getBudgetVariance(item: any): number {
    return item.actual - item.planned;
  }

  // Symulacje akcji
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