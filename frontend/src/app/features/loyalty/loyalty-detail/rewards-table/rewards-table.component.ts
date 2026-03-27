import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Reward } from '../../loyalty.model';

@Component({
  selector: 'app-rewards-table',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatIconModule, MatButtonModule, MatTooltipModule],
  templateUrl: './rewards-table.component.html',
  styleUrls: ['./rewards-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RewardsTableComponent {
  rewards = input.required<Reward[]>();
  redeem = output<Reward>();

  displayedColumns: string[] = ['name', 'pointsCost', 'discount', 'code', 'expiresAt', 'actions'];

  onRedeem(reward: Reward) {
    this.redeem.emit(reward);
  }
}
