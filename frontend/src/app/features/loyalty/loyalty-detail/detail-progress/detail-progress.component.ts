import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-detail-progress',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detail-progress.component.html',
  styleUrls: ['./detail-progress.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailProgressComponent {
  readonly points = input.required<number>();
  readonly nextLevelThreshold = input.required<number>();
  readonly pointsToNextLevel = input<number>();
  readonly isMaxLevel = input<boolean>();

  readonly progressPercent = computed(() => {
    const points = this.points();
    const threshold = this.nextLevelThreshold();
    return (points / threshold) * 100;
  })

  readonly progressLabel = computed(() =>
    this.isMaxLevel() ? 'maksymalnego poziomu' : 'następnego poziomu'
  )
}
