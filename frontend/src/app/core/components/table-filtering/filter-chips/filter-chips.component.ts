import { ChangeDetectionStrategy, Component, computed, inject, Signal } from '@angular/core';
import { MatChipRow, MatChipSet } from '@angular/material/chips';
import { FilterService } from '../filters/base-filter/filter.service';

@Component({
  selector: 'app-filter-chips',
  templateUrl: './filter-chips.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatChipRow, MatChipSet],
})
export class FilterChipsComponent {
  readonly filterService = inject(FilterService);
  readonly filterValues: Signal<unknown[]> = computed(
    () => this.filterService.currentFilters().map((f) => f.value).filter(Boolean) ?? [],
  );
}
