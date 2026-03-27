import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-points-summary',
  standalone: true,
  imports: [],
  templateUrl: './points-summary.component.html',
  styleUrls: ['./points-summary.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PointsSummaryComponent {
  label = input.required<string>();
  value = input.required<number>();
}
