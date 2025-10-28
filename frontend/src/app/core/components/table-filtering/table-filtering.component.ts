import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Filter, FilterType } from './types';
import { SelectableFilterComponent } from "./filters/selectable-filter/selectable-filter.component";
import { DateFilterComponent } from "./filters/date-filter/date-filter.component";
import { FilterChipsComponent } from "./filter-chips/filter-chips.component";
import { FilterService } from './filters/base-filter/filter.service';

@Component({
  selector: 'app-table-filtering',
  templateUrl: './table-filtering.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SelectableFilterComponent, DateFilterComponent, FilterChipsComponent],
  providers: [FilterService],
})
export class TableFilteringComponent {
  readonly filters = input.required<Filter[]>();
  readonly FilterType = FilterType
}
