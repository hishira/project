import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-budget-cell',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './budget-cell.component.html',
  styleUrls: ['./budget-cell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BudgetCellComponent {
  spent = input.required<number>();
  total = input.required<number>();
  currency = input.required<string>();

  get budgetPercent(): number {
    return (this.spent() / this.total()) * 100;
  }
}
