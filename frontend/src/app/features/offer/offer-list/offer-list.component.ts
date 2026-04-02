import { ChangeDetectionStrategy, Component, inject, signal, viewChild, AfterViewInit } from '@angular/core';
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
import { OfferFiltersComponent } from './offer-filters/offer-filters.component';
import { OfferStatusChipComponent } from './offer-status-chip/offer-status-chip.component';
import { OfferActionsComponent } from './offer-actions/offer-actions.component';
import { MainPageViewComponent } from '../../../core/components/main-page-view/main-page-view.component';
import { PageHeaderComponent } from '../../../core/components/page-header/page-header.component';

@Component({
  selector: 'app-offer-list',
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
    OfferFiltersComponent,
    OfferStatusChipComponent,
    OfferActionsComponent,
    MainPageViewComponent,
    PageHeaderComponent,
  ],
  templateUrl: './offer-list.component.html',
  styleUrls: ['./offer-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OfferListComponent implements AfterViewInit {
  private readonly offerService = inject(OfferService);
  readonly offers = this.offerService.offers;

  readonly dataSource = signal<MatTableDataSource<Offer>>(new MatTableDataSource<Offer>([]));
  readonly displayedColumns: string[] = ['number', 'title', 'client', 'issueDate', 'validUntil', 'total', 'status', 'actions'];

  readonly sort = viewChild(MatSort);
  readonly paginator = viewChild(MatPaginator);

  readonly filterNumber = signal<string>('');
  readonly filterClient = signal<string>('');
  readonly filterStatus = signal<OfferStatus | ''>('');

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
    const dataSource = new MatTableDataSource<Offer>(this.offers());
    this.dataSource.set(dataSource);
  }

  private filterPredicate = (data: Offer, filter: string): boolean => {
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

  onFilterStatusChange(status: OfferStatus | '') {
    this.filterStatus.set(status);
    this.applyFilters();
  }

  onAdd() {
    console.log('Dodaj nową ofertę');
  }

  onEdit(offer: Offer) {
    console.log('Edytuj ofertę', offer.id);
  }

  onDelete(offer: Offer) {
    this.offerService.deleteOffer(offer.id);
  }
}