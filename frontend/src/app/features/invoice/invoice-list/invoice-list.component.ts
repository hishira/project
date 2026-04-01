import { ChangeDetectionStrategy, Component, inject, signal, viewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { InvoiceFiltersComponent } from './invoice-filters/invoice-filters.component';
import { InvoiceStatusChipComponent } from './invoice-status-chip/invoice-status-chip.component';
import { InvoiceActionsComponent } from './invoice-actions/invoice-actions.component';

@Component({
  selector: 'app-invoice-list',
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
    InvoiceFiltersComponent,
    InvoiceStatusChipComponent,
    InvoiceActionsComponent,
  ],
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvoiceListComponent implements AfterViewInit {
  private readonly invoiceService = inject(InvoiceService);
  readonly invoices = this.invoiceService.invoices;

  readonly dataSource = signal<MatTableDataSource<Invoice>>(new MatTableDataSource<Invoice>([]));
  readonly displayedColumns: string[] = ['number', 'client', 'issueDate', 'dueDate', 'total', 'status', 'actions'];

  readonly sort = viewChild(MatSort);
  readonly paginator = viewChild(MatPaginator);

  readonly filterNumber = signal<string>('');
  readonly filterClient = signal<string>('');
  readonly filterStatus = signal<InvoiceStatus | ''>('');

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
    const dataSource = new MatTableDataSource<Invoice>(this.invoices());
    this.dataSource.set(dataSource);
  }

  private filterPredicate = (data: Invoice, filter: string): boolean => {
    const filterObj = JSON.parse(filter);
    if (filterObj.number && !data.number.toLowerCase().includes(filterObj.number.toLowerCase())) return false;
    if (filterObj.client && !data.clientName.toLowerCase().includes(filterObj.client.toLowerCase())) return false;
    if (filterObj.status && data.status !== filterObj.status) return false;
    return true;
  };

  applyFilters() {
    const dataSource = this.dataSource();
    const filterObj = {
      number: this.filterNumber(),
      client: this.filterClient(),
      status: this.filterStatus(),
    };
    dataSource.filter = JSON.stringify(filterObj);
  }

  clearFilters() {
    this.filterNumber.set('');
    this.filterClient.set('');
    this.filterStatus.set('');
    this.applyFilters();
  }

  onFilterNumberChange(number: string) {
    this.filterNumber.set(number);
    this.applyFilters();
  }

  onFilterClientChange(client: string) {
    this.filterClient.set(client);
    this.applyFilters();
  }

  onFilterStatusChange(status: InvoiceStatus | '') {
    this.filterStatus.set(status);
    this.applyFilters();
  }

  onAdd() {
    console.log('Dodaj nową fakturę');
  }

  onEdit(inv: Invoice) {
    console.log('Edytuj fakturę', inv.id);
  }

  onDelete(inv: Invoice) {
    this.invoiceService.deleteInvoice(inv.id);
  }
}