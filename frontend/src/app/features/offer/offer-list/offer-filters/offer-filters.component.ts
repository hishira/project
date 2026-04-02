import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { OfferStatus } from '../../offer.model';
import { OFFER_STATUS_OPTIONS } from '../../offer.utils';

@Component({
  selector: 'app-offer-filters',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './offer-filters.component.html',
  styleUrls: ['./offer-filters.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OfferFiltersComponent {
  filterNumber = input<string>('');
  filterClient = input<string>('');
  filterStatus = input<OfferStatus | ''>('');

  filterNumberChange = output<string>();
  filterClientChange = output<string>();
  filterStatusChange = output<OfferStatus | ''>();
  clearFilters = output<void>();

  readonly statusOptions = OFFER_STATUS_OPTIONS;
}
