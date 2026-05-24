import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-points-summary',
  templateUrl: './points-summary.component.html',
  styleUrls: ['./points-summary.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PointsSummaryComponent {
  readonly label = input.required<string>();
  readonly value = input.required<number>();
}
