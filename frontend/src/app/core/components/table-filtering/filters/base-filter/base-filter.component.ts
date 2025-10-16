import { computed, Directive, input } from '@angular/core';
import { Filter, FilterConfig } from '../../types';

@Directive()
export abstract class BaseFilterComponent<T extends FilterConfig> {
  readonly filter = input.required<Filter>();
  readonly label = computed(() => this.filter().label);
  readonly config = computed(() => this.filter().config as T);
}
