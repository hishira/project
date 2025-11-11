import { computed, Directive, inject, input } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl } from '@angular/forms';
import { Filter, FilterConfig } from '../../types';
import { FilterActionLogic } from './filter-action-logic.service';
import { FilterService } from './filter.service';
@Directive()
export abstract class BaseFilterComponent<T extends FilterConfig> {
  readonly filter = input.required<Filter>();
  readonly label = computed(() => this.filter().label);
  readonly config = computed(() => this.filter().config as T);
  readonly filterService = inject(FilterService);
  readonly filterActions = inject(FilterActionLogic);
  readonly control = new FormControl(null);

  abstract saveFilterValue(value: unknown): void;

  abstract resetFilter(): void;

  constructor() {
    this.filterActions.addFilter(this);
    this.control.valueChanges.pipe(takeUntilDestroyed()).subscribe((val) => this.saveFilterValue(val));
  }
}
