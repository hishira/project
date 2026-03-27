import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MembershipLevel } from '../../loyalty.model';
import { getLevelColor, getLevelIcon } from '../../loyalty.utils';

@Component({
  selector: 'app-level-summary-badge',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './level-summary-badge.component.html',
  styleUrls: ['./level-summary-badge.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LevelSummaryBadgeComponent {
  level = input.required<MembershipLevel>();

  getLevelColor = getLevelColor;
  getLevelIcon = getLevelIcon;
}
