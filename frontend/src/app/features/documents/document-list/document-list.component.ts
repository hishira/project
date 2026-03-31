import { ChangeDetectionStrategy, Component, inject, signal, viewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
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
import { Document, DocumentType } from '../document.models';
import { DocumentService } from '../document.service';
import { DocumentFiltersComponent } from './document-filters/document-filters.component';
import { DocumentTypeIconComponent } from './document-type-icon/document-type-icon.component';
import { DocumentNameCellComponent } from './document-name-cell/document-name-cell.component';
import { DocumentActionsComponent } from './document-actions/document-actions.component';

@Component({
  selector: 'app-document-list',
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
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule,
    MatCardModule,
    MainPageViewComponent,
    PageHeaderComponent,
    DocumentFiltersComponent,
    DocumentTypeIconComponent,
    DocumentNameCellComponent,
    DocumentActionsComponent,
  ],
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentListComponent implements AfterViewInit {
  private readonly documentService = inject(DocumentService);
  readonly documents = this.documentService.documents;

  readonly dataSource = signal<MatTableDataSource<Document>>(new MatTableDataSource<Document>([]));
  readonly displayedColumns: string[] = ['type', 'name', 'client', 'uploaded', 'size', 'version', 'actions'];

  readonly sort = viewChild(MatSort);
  readonly paginator = viewChild(MatPaginator);

  readonly filterType = signal<DocumentType | ''>('');
  readonly filterClient = signal<string>('');
  readonly filterDateFrom = signal<Date | null>(null);
  readonly filterDateTo = signal<Date | null>(null);

  ngAfterViewInit() {
    this.updateDataSource();
    const dataSource = this.dataSource();
    const sort = this.sort();
    const paginator = this.paginator();
    if (sort && paginator) {
      dataSource.sort = sort;
      dataSource.paginator = paginator;
      dataSource.filterPredicate = this.filterPredicate;
    }
  }

  private updateDataSource() {
    const dataSource = new MatTableDataSource<Document>(this.documents());
    this.dataSource.set(dataSource);
  }

  private filterPredicate = (data: Document, filter: string): boolean => {
    const filterObj = JSON.parse(filter);
    if (filterObj.type && data.type !== filterObj.type) return false;
    if (filterObj.client && !data.clientName.toLowerCase().includes(filterObj.client.toLowerCase())) return false;
    if (filterObj.dateFrom && new Date(data.uploadedAt) < new Date(filterObj.dateFrom)) return false;
    if (filterObj.dateTo && new Date(data.uploadedAt) > new Date(filterObj.dateTo)) return false;
    return true;
  };

  applyFilters() {
    const dataSource = this.dataSource();
    const filterObj = {
      type: this.filterType(),
      client: this.filterClient(),
      dateFrom: this.filterDateFrom(),
      dateTo: this.filterDateTo(),
    };
    dataSource.filter = JSON.stringify(filterObj);
  }

  clearFilters() {
    this.filterType.set('');
    this.filterClient.set('');
    this.filterDateFrom.set(null);
    this.filterDateTo.set(null);
    this.applyFilters();
  }

  onFilterTypeChange(type: DocumentType | '') {
    this.filterType.set(type);
    this.applyFilters();
  }

  onFilterClientChange(client: string) {
    this.filterClient.set(client);
    this.applyFilters();
  }

  onFilterDateFromChange(date: Date | null) {
    this.filterDateFrom.set(date);
    this.applyFilters();
  }

  onFilterDateToChange(date: Date | null) {
    this.filterDateTo.set(date);
    this.applyFilters();
  }
}