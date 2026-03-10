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
import { OfferService } from '../offer.service';
import { Offer, OfferStatus } from '../offer.model';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-offer-list',
  standalone: true,
  imports: [
    CommonModule, RouterLink,
    MatTableModule, MatSortModule, MatPaginatorModule,
    MatIconModule, MatButtonModule, MatChipsModule, MatTooltipModule,
    MatFormFieldModule, MatInputModule, MatSelectModule, FormsModule, MatCardModule
  ],
  templateUrl: './offer-list.component.html',
  styleUrls: ['./offer-list.component.scss']
})
export class OfferListComponent {
  private offerService = inject(OfferService);
  offers = this.offerService.offers;

  dataSource = new MatTableDataSource<Offer>(this.offers());
  displayedColumns: string[] = ['number', 'title', 'client', 'issueDate', 'validUntil', 'total', 'status', 'actions'];

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  filterNumber = '';
  filterClient = '';
  filterStatus: OfferStatus | '' = '';

  statuses: { value: OfferStatus; label: string }[] = [
    { value: 'draft', label: 'Szkic' },
    { value: 'sent', label: 'Wysłana' },
    { value: 'accepted', label: 'Zaakceptowana' },
    { value: 'rejected', label: 'Odrzucona' },
    { value: 'expired', label: 'Wygasła' }
  ];

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.dataSource.filterPredicate = (data: Offer, filter: string) => {
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

  getStatusClass(status: OfferStatus): string {
    const map: Record<OfferStatus, string> = {
      draft: 'status-draft',
      sent: 'status-sent',
      accepted: 'status-accepted',
      rejected: 'status-rejected',
      expired: 'status-expired'
    };
    return map[status];
  }

  getStatusLabel(status: OfferStatus): string {
    const map: Record<OfferStatus, string> = {
      draft: 'Szkic',
      sent: 'Wysłana',
      accepted: 'Zaakceptowana',
      rejected: 'Odrzucona',
      expired: 'Wygasła'
    };
    return map[status];
  }

  onAdd() {
    console.log('Dodaj nową ofertę');
  }

  onEdit(offer: Offer, event: MouseEvent) {
    event.stopPropagation();
    console.log('Edytuj ofertę', offer.id);
  }

  onDelete(offer: Offer, event: MouseEvent) {
    event.stopPropagation();
    this.offerService.deleteOffer(offer.id);
  }
}