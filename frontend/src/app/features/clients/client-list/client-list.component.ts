import { AfterViewInit, Component, inject, signal, ViewChild } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
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
import { MatCardModule } from '@angular/material/card';
import { ChangeDetectionStrategy } from '@angular/core';
import { ClientService } from '../client.service';
import { Client, ClientStatus } from '../client.model';
import { getClientStatusLabel, getClientStatusClass } from '../client-status.utils';
import { PageHeaderComponent } from '../../../core/components/page-header/page-header.component';
import { MainPageViewComponent } from '../../../core/components/main-page-view/main-page-view.component';

@Component({
  selector: 'app-client-list',
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
    DatePipe,
    PageHeaderComponent,
    MainPageViewComponent,
  ],
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClientListComponent implements AfterViewInit {
  private clientService = inject(ClientService);
  readonly clients = this.clientService.clients;

  readonly dataSource = new MatTableDataSource<Client>(this.clients());
  readonly displayedColumns: string[] = ['name', 'taxId', 'mainContact', 'status', 'documents', 'lastContact', 'actions'];

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  readonly filterName = signal<string>('');
  readonly filterStatus = signal<ClientStatus | ''>('');

  readonly statuses: { value: ClientStatus; label: string }[] = [
    { value: 'active', label: 'Aktywny' },
    { value: 'inactive', label: 'Nieaktywny' },
    { value: 'lead', label: 'Potencjalny' },
    { value: 'former', label: 'Były' }
  ];

  readonly getStatusLabel = getClientStatusLabel;
  readonly getStatusChipClass = getClientStatusClass;

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.dataSource.filterPredicate = this.createFilterPredicate();
  }

  applyFilters(): void {
    const filterObj = {
      name: this.filterName(),
      status: this.filterStatus()
    };
    this.dataSource.filter = JSON.stringify(filterObj);
  }

  clearFilters(): void {
    this.filterName.set('');
    this.filterStatus.set('');
    this.applyFilters();
  }

  private createFilterPredicate(): (data: Client, filter: string) => boolean {
    return (data: Client, filter: string): boolean => {
      const filterObj = JSON.parse(filter) as { name?: string; status?: ClientStatus | '' };
      const matchesName = !filterObj.name || data.name.toLowerCase().includes(filterObj.name.toLowerCase());
      const matchesStatus = !filterObj.status || data.status === filterObj.status;
      return matchesName && matchesStatus;
    };
  }
}
