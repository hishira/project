import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { Invoice } from '../../invoice.model';
import { getInvoiceStatusClass, getInvoiceStatusLabel } from '../../invoice.utils';

@Component({
  selector: 'app-invoice-summary',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatChipsModule],
  templateUrl: './invoice-summary.component.html',
  styleUrls: ['./invoice-summary.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvoiceSummaryComponent {
  invoice = input.required<Invoice>();

  getStatusClass = getInvoiceStatusClass;
  getStatusLabel = getInvoiceStatusLabel;
}
