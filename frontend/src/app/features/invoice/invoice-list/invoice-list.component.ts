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
import { Invoice, InvoiceStatus } from '../invoice.model';
import { InvoiceService } from '../invoice.service';

@Component({
  selector: 'app-invoice-list',
  standalone: true,
  imports: [
    CommonModule, RouterLink,
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
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.scss']
})
export class InvoiceListComponent {
  private invoiceService = inject(InvoiceService);
  invoices = this.invoiceService.invoices;

  dataSource = new MatTableDataSource<Invoice>(this.invoices());
  displayedColumns: string[] = ['number', 'client', 'issueDate', 'dueDate', 'total', 'status', 'actions'];

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  filterNumber = '';
  filterClient = '';
  filterStatus: InvoiceStatus | '' = '';

  statuses: { value: InvoiceStatus; label: string }[] = [
    { value: 'draft', label: 'Szkic' },
    { value: 'sent', label: 'Wysłana' },
    { value: 'paid', label: 'Opłacona' },
    { value: 'overdue', label: 'Zaległa' },
    { value: 'cancelled', label: 'Anulowana' }
  ];

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.dataSource.filterPredicate = (data: Invoice, filter: string) => {
      const filterObj = JSON.parse(filter);
      if (filterObj.number && !data.number.toLowerCase().includes(filterObj.number.toLowerCase())) return false;
      if (filterObj.client && !data.clientName.toLowerCase().includes(filterObj.client.toLowerCase())) return false;
      if (filterObj.status && data.status !== filterObj.status) return false;
      return true;
    };
  }

  applyFilters() {
    const filterObj = {
      number: this.filterNumber,
      client: this.filterClient,
      status: this.filterStatus
    };
    this.dataSource.filter = JSON.stringify(filterObj);
  }

  clearFilters() {
    this.filterNumber = '';
    this.filterClient = '';
    this.filterStatus = '';
    this.applyFilters();
  }

  getStatusClass(status: InvoiceStatus): string {
    const map: Record<InvoiceStatus, string> = {
      draft: 'status-draft',
      sent: 'status-sent',
      paid: 'status-paid',
      overdue: 'status-overdue',
      cancelled: 'status-cancelled'
    };
    return map[status];
  }

  getStatusLabel(status: InvoiceStatus): string {
    const map: Record<InvoiceStatus, string> = {
      draft: 'Szkic',
      sent: 'Wysłana',
      paid: 'Opłacona',
      overdue: 'Zaległa',
      cancelled: 'Anulowana'
    };
    return map[status];
  }

  onAdd() {
    console.log('Dodaj nową fakturę');
  }

  onEdit(inv: Invoice, event: MouseEvent) {
    event.stopPropagation();
    console.log('Edytuj fakturę', inv.id);
  }

  onDelete(inv: Invoice, event: MouseEvent) {
    event.stopPropagation();
    this.invoiceService.deleteInvoice(inv.id);
  }
}