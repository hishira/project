import { Injectable, signal, WritableSignal } from '@angular/core';
import { FilterValue } from './types';

@Injectable()
export class FilterService {
  private readonly _currentFilters: WritableSignal<FilterValue[]> = signal([]);
  currentFilters = this._currentFilters.asReadonly();

  updateFilters(filterValue: FilterValue): void {
    this._currentFilters.update((filters) => {
      console.log(filters)
      if (filters.some((f) => f.filterLabel === filterValue.filterLabel)) {
        return filters;
      } else {
        return [...filters, filterValue];
      }
    });
  }
}
