import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Filter, FilterType } from './types';
import { SelectableFilterComponent } from "./filters/selectable-filter/selectable-filter.component";

@Component({
  selector: 'app-table-filtering',
  templateUrl: './table-filtering.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SelectableFilterComponent],
})
export class TableFilteringComponent {
  readonly filters = input.required<Filter[]>();
  readonly FilterType = FilterType
}
