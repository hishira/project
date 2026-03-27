import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CustomerLoyalty } from '../../loyalty.model';

@Component({
  selector: 'app-customer-cell',
  standalone: true,
  imports: [],
  templateUrl: './customer-cell.component.html',
  styleUrls: ['./customer-cell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerCellComponent {
  customer = input.required<CustomerLoyalty>();
}
