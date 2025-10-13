import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Filter } from './types';

@Component({
  selector: 'app-table-filtering',
  templateUrl: './table-filtering.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
})
export class TableFilteringComponent {
  filter = input.required<Filter[]>();
}
