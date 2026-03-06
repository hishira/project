import { Component, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { ProjectService } from '../project.service';
import { Project, ProjectStatus } from '../project.model';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    MatCardModule
  ],
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']
})
export class ProjectListComponent {
  private readonly projectService = inject(ProjectService);
  projects = this.projectService.projects;

  dataSource = new MatTableDataSource<Project>(this.projects());
  displayedColumns: string[] = ['name', 'client', 'status', 'dates', 'budget', 'progress', 'actions'];

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  filterName = '';
  filterStatus: ProjectStatus | '' = '';

  statuses: { value: ProjectStatus; label: string }[] = [
    { value: 'planned', label: 'Planowany' },
    { value: 'active', label: 'Aktywny' },
    { value: 'on_hold', label: 'Wstrzymany' },
    { value: 'completed', label: 'Zakończony' },
    { value: 'cancelled', label: 'Anulowany' }
  ];

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.dataSource.filterPredicate = (data: Project, filter: string) => {
      const filterObj = JSON.parse(filter);
      if (filterObj.name && !data.name.toLowerCase().includes(filterObj.name.toLowerCase())) return false;
      if (filterObj.status && data.status !== filterObj.status) return false;
      return true;
    };
  }

  applyFilters() {
    const filterObj = {
      name: this.filterName,
      status: this.filterStatus
    };
    this.dataSource.filter = JSON.stringify(filterObj);
  }

  clearFilters() {
    this.filterName = '';
    this.filterStatus = '';
    this.applyFilters();
  }

  getStatusClass(status: ProjectStatus): string {
    const map: Record<ProjectStatus, string> = {
      planned: 'status-planned',
      active: 'status-active',
      on_hold: 'status-on-hold',
      completed: 'status-completed',
      cancelled: 'status-cancelled'
    };
    return map[status];
  }

  getStatusLabel(status: ProjectStatus): string {
    const map: Record<ProjectStatus, string> = {
      planned: 'Planowany',
      active: 'Aktywny',
      on_hold: 'Wstrzymany',
      completed: 'Zakończony',
      cancelled: 'Anulowany'
    };
    return map[status];
  }

  calculateProgress(project: Project): number {
    if (!project.tasks || project.tasks.length === 0) return 0;
    const done = project.tasks.filter(t => t.status === 'done').length;
    return Math.round((done / project.tasks.length) * 100);
  }

  onAdd() {
    console.log('Dodaj nowy projekt');
  }

  onEdit(project: Project, event: MouseEvent) {
    event.stopPropagation();
    console.log('Edytuj projekt:', project.id);
  }

  onDelete(project: Project, event: MouseEvent) {
    event.stopPropagation();
    console.log('Usuń projekt:', project.id);
  }
}