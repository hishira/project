import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-budget-cell',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './budget-cell.component.html',
  styleUrls: ['./budget-cell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BudgetCellComponent {
  readonly spent = input.required<number>();
  readonly total = input.required<number>();
  readonly currency = input.required<string>();
  readonly budgetPercent = computed(() => (this.spent() / this.total()) * 100);

}
