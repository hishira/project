import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { BudgetItem } from '../../project.model';

@Component({
  selector: 'app-budget-table',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTableModule],
  templateUrl: './budget-table.component.html',
  styleUrls: ['./budget-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BudgetTableComponent {
  items = input.required<BudgetItem[]>();
  total = input.required<number>();
  spent = input.required<number>();
  currency = input.required<string>();

  displayedColumns: string[] = ['name', 'planned', 'actual', 'variance'];

  getBudgetVariance(item: BudgetItem): number {
    return item.actual - item.planned;
  }

  isPositiveVariance(variance: number): boolean {
    return variance < 0; // Lower actual cost is positive
  }

  isNegativeVariance(variance: number): boolean {
    return variance > 0; // Higher actual cost is negative
  }
}
