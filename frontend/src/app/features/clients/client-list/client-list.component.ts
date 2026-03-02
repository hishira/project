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
import { ClientService } from '../client.service';
import { Client, ClientStatus } from '../client.model';
import { MatCardModule } from '@angular/material/card';

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
  ],
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.scss']
})
export class ClientListComponent {
  private clientService = inject(ClientService);
  clients = this.clientService.clients;

  dataSource = new MatTableDataSource<Client>(this.clients());
  displayedColumns: string[] = ['name', 'taxId', 'mainContact', 'status', 'documents', 'lastContact', 'actions'];

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  filterName = '';
  filterStatus: ClientStatus | '' = '';

  statuses: { value: ClientStatus; label: string }[] = [
    { value: 'active', label: 'Aktywny' },
    { value: 'inactive', label: 'Nieaktywny' },
    { value: 'lead', label: 'Potencjalny' },
    { value: 'former', label: 'Były' }
  ];

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.dataSource.filterPredicate = (data: Client, filter: string) => {
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

  getStatusChipClass(status: ClientStatus): string {
    const map: Record<ClientStatus, string> = {
      active: 'status-active',
      inactive: 'status-inactive',
      lead: 'status-lead',
      former: 'status-former'
    };
    return map[status];
  }

  getStatusLabel(status: ClientStatus): string {
    const map: Record<ClientStatus, string> = {
      active: 'Aktywny',
      inactive: 'Nieaktywny',
      lead: 'Potencjalny',
      former: 'Były'
    };
    return map[status];
  }
}