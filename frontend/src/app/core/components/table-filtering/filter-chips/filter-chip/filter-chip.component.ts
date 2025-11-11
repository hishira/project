import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { FilterService } from '../../filters/base-filter/filter.service';
import { FilterValue } from '../../filters/base-filter/types';

@Component({
  selector: 'app-filter-chip',
  templateUrl: './filter-chip.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatChipsModule, MatIconModule],
})
export class FilterChipComponent {
  readonly filter = input.required<FilterValue>();
  readonly filterService = inject(FilterService);
  
  onChipRemove(filter: FilterValue): void {
    this.filterService.removeFilter(filter);
  }
}
