import { computed, Directive, inject, input } from '@angular/core';
import { Filter, FilterConfig } from '../../types';
import { FilterService } from './filter.service';
import { FormControl } from '@angular/forms';
import { FilterValue } from './types';

@Directive()
export abstract class BaseFilterComponent<T extends FilterConfig> {
  readonly filter = input.required<Filter>();
  readonly label = computed(() => this.filter().label);
  readonly config = computed(() => this.filter().config as T);
  readonly filterService = inject(FilterService);
  readonly control = new FormControl(null);

  abstract saveFilterValue(): void;
}
