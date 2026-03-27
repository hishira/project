import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Level } from '../../loyalty.model';
import { getLevelColor, getLevelIcon } from '../../loyalty.utils';

@Component({
  selector: 'app-level-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  templateUrl: './level-card.component.html',
  styleUrls: ['./level-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LevelCardComponent {
  level = input.required<Level>();
  
  getLevelColor = getLevelColor;
  getLevelIcon = getLevelIcon;
}
