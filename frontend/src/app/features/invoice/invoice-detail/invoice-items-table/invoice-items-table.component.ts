import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { InvoiceItem } from '../../invoice.model';

@Component({
  selector: 'app-invoice-items-table',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTableModule],
  templateUrl: './invoice-items-table.component.html',
  styleUrls: ['./invoice-items-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvoiceItemsTableComponent {
  items = input.required<InvoiceItem[]>();
  totalNet = input.required<number>();
  totalVat = input.required<number>();
  totalGross = input.required<number>();
  currency = input.required<string>();

  displayedColumns: string[] = ['name', 'quantity', 'netPrice', 'vatRate', 'netAmount', 'vatAmount', 'grossAmount'];
}
