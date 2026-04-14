import { CommonModule, DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { PageHeaderComponent } from '../../../core/components/page-header/page-header.component';
import { MainPageViewComponent } from '../../../core/components/main-page-view/main-page-view.component';
import { AgreementListItem } from './agreement-list.mock';
import { mockAgreements } from './agreement-list.mock';
import { AgreementStatusType } from '../types';
import {
  AgreementStatus,
  agreementStatusOptions,
  agreementCategoryOptions,
  getAgreementStatusClass,
  getAgreementStatusLabel
} from './agreement-list.constants';

@Component({
  selector: 'app-agreement-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    DatePipe,
    PageHeaderComponent,
    MainPageViewComponent
  ],
  templateUrl: './agreement-list.component.html',
  styleUrls: ['./agreement-list.component.scss']
})
export class AgreementListComponent {
  readonly agreements = signal<AgreementListItem[]>(mockAgreements);

  readonly filterStatus = signal<AgreementStatus | ''>('');
  readonly filterCategory = signal<string>('');
  readonly searchQuery = signal<string>('');

  readonly statuses = agreementStatusOptions;
  readonly categories = agreementCategoryOptions;

  readonly getStatusChipClass = getAgreementStatusClass;
  readonly getStatusLabel = getAgreementStatusLabel;

  readonly filteredAgreements = computed(() => {
    let result = this.agreements();
    const status = this.filterStatus();
    const category = this.filterCategory();
    const search = this.searchQuery().toLowerCase();

    if (status) {
      result = result.filter(a => a.status === status);
    }
    if (category) {
      result = result.filter(a => a.productCategory === category);
    }
    if (search) {
      result = result.filter(a =>
        a.title.toLowerCase().includes(search) ||
        a.clientName.toLowerCase().includes(search) ||
        a.contractId.toLowerCase().includes(search)
      );
    }

    return result;
  });

  clearFilters(): void {
    this.filterStatus.set('');
    this.filterCategory.set('');
    this.searchQuery.set('');
  }
}
