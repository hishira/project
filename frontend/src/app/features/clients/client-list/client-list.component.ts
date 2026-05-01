import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, inject, signal, viewChild } from '@angular/core';
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
import { getClientStatusClass, getClientStatusLabel } from '../client-status.utils';
import { Client, ClientStatus } from '../client.model';
import { ClientService } from '../client.service';
import { ClientListFiltersComponent } from './client-list-filters.component';
import { CLIENT_STATUSES, DISPLAYED_COLUMNS } from './client-list.consts';

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
export class ClientListComponent {
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
