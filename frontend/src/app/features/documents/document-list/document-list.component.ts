import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
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
import { Document, DocumentType } from '../document.models';
import { DocumentService } from '../document.service';

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
    MatCardModule
  ],
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.scss']
})
export class DocumentListComponent {
  private documentService = inject(DocumentService);
  documents = this.documentService.documents;

  // Źródło danych dla tabeli
  dataSource = new MatTableDataSource<Document>(this.documents());

  // Kolumny
  displayedColumns: string[] = ['type', 'name', 'client', 'uploaded', 'size', 'version', 'actions'];

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // Filtry
  filterType: DocumentType | '' = '';
  filterClient = '';
  filterDateFrom: Date | null = null;
  filterDateTo: Date | null = null;

  // Lista typów do selecta
  documentTypes: { value: DocumentType; label: string }[] = [
    { value: 'contract', label: 'Umowa' },
    { value: 'annex', label: 'Aneks' },
    { value: 'specification', label: 'Specyfikacja' },
    { value: 'protocol', label: 'Protokół' },
    { value: 'other', label: 'Inny' }
  ];

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    // Własny filtr
    this.dataSource.filterPredicate = (data: Document, filter: string) => {
      const filterObj = JSON.parse(filter);
      // Filtrowanie po typie
      if (filterObj.type && data.type !== filterObj.type) return false;
      // Po kliencie (nazwa)
      if (filterObj.client && !data.clientName.toLowerCase().includes(filterObj.client.toLowerCase())) return false;
      // Po dacie (zakres)
      if (filterObj.dateFrom && new Date(data.uploadedAt) < new Date(filterObj.dateFrom)) return false;
      if (filterObj.dateTo && new Date(data.uploadedAt) > new Date(filterObj.dateTo)) return false;
      return true;
    };
  }

  applyFilters() {
    const filterObj = {
      type: this.filterType,
      client: this.filterClient,
      dateFrom: this.filterDateFrom,
      dateTo: this.filterDateTo
    };
    this.dataSource.filter = JSON.stringify(filterObj);
  }

  clearFilters() {
    this.filterType = '';
    this.filterClient = '';
    this.filterDateFrom = null;
    this.filterDateTo = null;
    this.applyFilters();
  }

  getTypeIcon(type: DocumentType): string {
    const icons: Record<DocumentType, string> = {
      contract: 'description',
      annex: 'note_add',
      specification: 'science',
      protocol: 'assignment',
      other: 'insert_drive_file'
    };
    return icons[type] || 'description';
  }

  getTypeLabel(type: DocumentType): string {
    const labels: Record<DocumentType, string> = {
      contract: 'Umowa',
      annex: 'Aneks',
      specification: 'Specyfikacja',
      protocol: 'Protokół',
      other: 'Inny'
    };
    return labels[type];
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }
}