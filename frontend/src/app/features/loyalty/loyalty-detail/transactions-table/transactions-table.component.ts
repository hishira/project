import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatTableModule } from '@angular/material/table';
import { PointsTransaction } from '../../loyalty.model';

@Component({
  selector: 'app-transactions-table',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatChipsModule],
  templateUrl: './transactions-table.component.html',
  styleUrls: ['./transactions-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionsTableComponent {
  transactions = input.required<PointsTransaction[]>();

  displayedColumns: string[] = ['date', 'description', 'pointsChange', 'balanceAfter', 'source'];

  getPointsChangeColor(pointsChange: number): string {
    return pointsChange > 0 ? '#2e7d32' : '#d32f2f';
  }

  formatPointsChange(pointsChange: number): string {
    return pointsChange > 0 ? `+${pointsChange}` : `${pointsChange}`;
  }
}
