import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { OfferStatus } from '../../offer.model';
import { getOfferStatusClass, getOfferStatusLabel } from '../../offer.utils';

@Component({
  selector: 'app-offer-status-chip',
  imports: [MatChipsModule],
  templateUrl: './offer-status-chip.component.html',
  styleUrls: ['./offer-status-chip.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OfferStatusChipComponent {
  status = input.required<OfferStatus>();

  getStatusClass = getOfferStatusClass;
  getStatusLabel = getOfferStatusLabel;
}
