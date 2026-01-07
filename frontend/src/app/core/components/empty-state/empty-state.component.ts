import { ChangeDetectionStrategy, Component, input, InputSignal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-empty-state',
  templateUrl: './empty-state.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatIconModule],
})
export class EmptyStateComponent {
  readonly label: InputSignal<string> = input.required<string>();
  readonly isEmpty: InputSignal<boolean> = input.required<boolean>();
}
