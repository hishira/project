import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-detail-progress',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detail-progress.component.html',
  styleUrls: ['./detail-progress.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailProgressComponent {
  points = input.required<number>();
  nextLevelThreshold = input.required<number>();
  pointsToNextLevel = input<number>();
  isMaxLevel = input<boolean>();

  get progressPercent(): number {
    const points = this.points();
    const threshold = this.nextLevelThreshold();
    return (points / threshold) * 100;
  }

  get progressLabel(): string {
    return this.isMaxLevel() ? 'maksymalnego poziomu' : 'następnego poziomu';
  }
}
