import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MembershipLevel } from '../../loyalty.model';
import { getLevelColor, getLevelIcon } from '../../loyalty.utils';

@Component({
  selector: 'app-level-badge',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './level-badge.component.html',
  styleUrls: ['./level-badge.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LevelBadgeComponent {
  level = input.required<MembershipLevel>();
  
  getLevelColor = getLevelColor;
  getLevelIcon = getLevelIcon;
}
