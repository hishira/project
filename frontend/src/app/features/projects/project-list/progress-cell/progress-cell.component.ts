import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-progress-cell',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './progress-cell.component.html',
  styleUrls: ['./progress-cell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgressCellComponent {
  progress = input.required<number>();
}
