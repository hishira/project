import { ChangeDetectionStrategy, Component, computed, inject, Signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { FilterService } from '../filters/base-filter/filter.service';
import { FilterValue } from '../filters/base-filter/types';
@Component({
  selector: 'app-filter-chips',
  templateUrl: './filter-chips.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [ MatChipsModule, MatIconModule, MatButtonModule],
})
export class FilterChipsComponent {
  readonly filterService = inject(FilterService);
  readonly filterValues: Signal<FilterValue[]> = computed(
    () =>
      this.filterService
        .currentFilters()
        // eslint-disable-next-line no-constant-binary-expression, @typescript-eslint/no-explicit-any
        .filter(v=> v !== null && v !== undefined) ?? [],
  );
  
  onChipRemove(event: unknown): void {
    console.log(event);
  }
}
