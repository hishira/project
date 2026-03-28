import { ChangeDetectionStrategy, Component, inject, signal, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Project, ProjectStatus } from '../project.model';
import { ProjectService } from '../project.service';
import { MainPageViewComponent } from '../../../core/components/main-page-view/main-page-view.component';
import { PageHeaderComponent } from '../../../core/components/page-header/page-header.component';
import { ProjectFiltersComponent } from './project-filters/project-filters.component';
import { ProjectTableComponent } from './project-table/project-table.component';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MainPageViewComponent,
    PageHeaderComponent,
    ProjectFiltersComponent,
    ProjectTableComponent,
  ],
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectListComponent implements AfterViewInit {
  private readonly projectService = inject(ProjectService);
  private readonly projects = this.projectService.projects;

  readonly dataSource = signal<MatTableDataSource<Project>>(new MatTableDataSource<Project>([]));
  readonly displayedColumns: string[] = ['name', 'client', 'status', 'dates', 'budget', 'progress', 'actions'];

  readonly filterName = signal<string>('');
  readonly filterStatus = signal<ProjectStatus | ''>('');

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  readonly statuses: { value: ProjectStatus; label: string }[] = [
    { value: 'planned', label: 'Planowany' },
    { value: 'active', label: 'Aktywny' },
    { value: 'on_hold', label: 'Wstrzymany' },
    { value: 'completed', label: 'Zakończony' },
    { value: 'cancelled', label: 'Anulowany' }
  ];

  ngAfterViewInit() {
    this.updateDataSource();
    const dataSource = this.dataSource();
    dataSource.sort = this.sort;
    dataSource.paginator = this.paginator;
    dataSource.filterPredicate = (data: Project, filter: string) => {
      const filterObj = JSON.parse(filter);
      if (filterObj.name && !data.name.toLowerCase().includes(filterObj.name.toLowerCase())) return false;
      if (filterObj.status && data.status !== filterObj.status) return false;
      return true;
    };
  }

  private updateDataSource() {
    const dataSource = new MatTableDataSource<Project>(this.projects());
    this.dataSource.set(dataSource);
  }

  applyFilters() {
    const dataSource = this.dataSource();
    const filterObj = {
      name: this.filterName(),
      status: this.filterStatus()
    };
    dataSource.filter = JSON.stringify(filterObj);
  }

  clearFilters() {
    this.filterName.set('');
    this.filterStatus.set('');
    this.applyFilters();
  }

  onAdd() {
    console.log('Dodaj nowy projekt');
  }

  onEdit(project: Project) {
    console.log('Edytuj projekt:', project.id);
  }
}