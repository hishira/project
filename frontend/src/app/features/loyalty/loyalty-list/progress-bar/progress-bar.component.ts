import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { getProgressWidth } from '../../loyalty.utils';

@Component({
  selector: 'app-progress-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgressBarComponent {
  points = input.required<number>();
  nextLevelThreshold = input<number | undefined>();
  level = input<string>();

  getProgressWidth = getProgressWidth;

  get isMaxLevel(): boolean {
    return !this.nextLevelThreshold();
  }

  get progressText(): string {
    const points = this.points();
    const threshold = this.nextLevelThreshold();
    if (!threshold) return '';
    return `${points} / ${threshold} pkt`;
  }

  get progressToNextText(): string {
    const points = this.points();
    const threshold = this.nextLevelThreshold();
    const level = this.level();
    if (!threshold) return '';
    const pointsToNext = threshold - points;
    const isMax = level === 'platinum';
    return `(${pointsToNext} do ${isMax ? 'max' : 'następnego'})`;
  }
}
