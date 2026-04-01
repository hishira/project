import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { InvoiceStatus } from '../../invoice.model';
import { getInvoiceStatusClass, getInvoiceStatusLabel } from '../../invoice.utils';

@Component({
  selector: 'app-invoice-status-chip',
  standalone: true,
  imports: [MatChipsModule],
  templateUrl: './invoice-status-chip.component.html',
  styleUrls: ['./invoice-status-chip.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvoiceStatusChipComponent {
  status = input.required<InvoiceStatus>();

  getStatusClass = getInvoiceStatusClass;
  getStatusLabel = getInvoiceStatusLabel;
}
