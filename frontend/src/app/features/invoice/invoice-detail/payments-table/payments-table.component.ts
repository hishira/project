import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatTableModule } from '@angular/material/table';
import { Payment } from '../../invoice.model';
import { getPaymentMethodLabel } from '../../invoice.utils';

@Component({
  selector: 'app-payments-table',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatChipsModule, MatTableModule],
  templateUrl: './payments-table.component.html',
  styleUrls: ['./payments-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentsTableComponent {
  payments = input.required<Payment[]>();
  currency = input.required<string>();

  paymentColumns: string[] = ['date', 'amount', 'method', 'reference', 'notes'];

  getPaymentMethodLabel = getPaymentMethodLabel;
}
