import { Component, computed, effect, inject, signal, viewChild } from '@angular/core';
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
import { ClientListFiltersComponent } from './client-list-filters.component';

const CLIENT_STATUSES: { value: ClientStatus; label: string }[] = [
  { value: 'active', label: 'Aktywny' },
  { value: 'inactive', label: 'Nieaktywny' },
  { value: 'lead', label: 'Potencjalny' },
  { value: 'former', label: 'Były' }
];

const DISPLAYED_COLUMNS: string[] = ['name', 'taxId', 'mainContact', 'status', 'documents', 'lastContact', 'actions'];

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
    ClientListFiltersComponent,
  ],
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClientListComponent  {
  private clientService = inject(ClientService);

  readonly filterName = signal<string>('');
  readonly filterStatus = signal<ClientStatus | ''>('');

  readonly statuses = CLIENT_STATUSES;
  readonly displayedColumns = DISPLAYED_COLUMNS;

  readonly getStatusLabel = getClientStatusLabel;
  readonly getStatusChipClass = getClientStatusClass;

  // Computed signal for filtered clients
  readonly filteredClients = computed(() => {
    const clients = this.clientService.clients();
    const nameFilter = this.filterName().toLowerCase().trim();
    const statusFilter = this.filterStatus();

    return clients.filter(client => {
      const matchesName = !nameFilter || client.name.toLowerCase().includes(nameFilter);
      const matchesStatus = !statusFilter || client.status === statusFilter;
      return matchesName && matchesStatus;
    });
  });

  readonly dataSource = new MatTableDataSource<Client>();

  readonly sort = viewChild(MatSort);
  readonly paginator = viewChild(MatPaginator);

  constructor() {
    effect(() => {
      const sort = this.sort();
      const paginator = this.paginator();

      if (sort) {
        this.dataSource.sort = sort;
      }

      if (paginator) {
        this.dataSource.paginator = paginator;
      }

      this.dataSource.data = this.filteredClients();
    });
  }

  onFiltersChange(filters: { name: string; status: ClientStatus | '' }): void {
    this.filterName.set(filters.name);
    this.filterStatus.set(filters.status);
  }
}
