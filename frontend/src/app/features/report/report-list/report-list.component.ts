import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { MainPageViewComponent } from '../../../core/components/main-page-view/main-page-view.component';
import { PageHeaderComponent } from '../../../core/components/page-header/page-header.component';
import { AnalyticsService } from '../analytics.service';
import { ReportDefinition } from '../report.models';

@Component({
  selector: 'app-report-list',
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
    MatCardModule,
    MainPageViewComponent,
    PageHeaderComponent,
  ],
  templateUrl: './report-list.component.html',
  styleUrls: ['./report-list.component.scss']
})
export class ReportListComponent {
  private analyticsService = inject(AnalyticsService);
  reports = this.analyticsService.reports;

  dataSource = new MatTableDataSource<ReportDefinition>(this.reports());
  displayedColumns: string[] = ['name', 'type', 'createdAt', 'lastRun', 'isFavorite', 'actions'];

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  filterName = '';
  filterType: string = '';

  types = [
    { value: 'sales', label: 'Sprzedaż' },
    { value: 'support', label: 'Obsługa' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'finance', label: 'Finanse' },
    { value: 'custom', label: 'Niestandardowe' }
  ];

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.dataSource.filterPredicate = (data: ReportDefinition, filter: string) => {
      const filterObj = JSON.parse(filter);
      if (filterObj.name && !data.name.toLowerCase().includes(filterObj.name.toLowerCase())) return false;
      if (filterObj.type && data.type !== filterObj.type) return false;
      return true;
    };
  }

  applyFilters() {
    const filterObj = {
      name: this.filterName,
      type: this.filterType
    };
    this.dataSource.filter = JSON.stringify(filterObj);
  }

  clearFilters() {
    this.filterName = '';
    this.filterType = '';
    this.applyFilters();
  }

  getTypeLabel(type: string): string {
    const map: Record<string, string> = {
      sales: 'Sprzedaż',
      support: 'Obsługa',
      marketing: 'Marketing',
      finance: 'Finanse',
      custom: 'Niestandardowy'
    };
    return map[type] || type;
  }

  onRun(report: ReportDefinition, event: MouseEvent) {
    event.stopPropagation();
    this.analyticsService.runReport(report.id);
  }

  onToggleFavorite(report: ReportDefinition, event: MouseEvent) {
    event.stopPropagation();
    this.analyticsService.toggleFavorite(report.id);
  }

  onExport(report: ReportDefinition, event: MouseEvent) {
    event.stopPropagation();
    this.analyticsService.exportReport(report.id, 'pdf');
  }

  onDelete(report: ReportDefinition, event: MouseEvent) {
    event.stopPropagation();
    this.analyticsService.deleteReport(report.id);
  }

  onAdd() {
    console.log('Tworzenie nowego raportu');
  }
}