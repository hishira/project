import { ChangeDetectionStrategy, Component, computed, inject, Signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { FilterService } from '../filters/base-filter/filter.service';
import { FilterValue } from '../filters/base-filter/types';
import { FilterChipComponent } from './filter-chip/filter-chip.component';
@Component({
  selector: 'app-filter-chips',
  templateUrl: './filter-chips.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatChipsModule, MatButtonModule, FilterChipComponent],
})
export class FilterChipsComponent {
  readonly filterService = inject(FilterService);
  readonly filterValues: Signal<FilterValue[]> = computed(() => this.filterService.currentFilters());
  readonly visibleFilters: Signal<FilterValue[]> = computed(() => this.filterValues()?.filter((f) => f?.value));
}
