import { Injectable, signal, WritableSignal } from '@angular/core';
import { FilterValue } from './types';

@Injectable()
export class FilterService {
  private readonly _currentFilters: WritableSignal<FilterValue[]> = signal([]);
  currentFilters = this._currentFilters.asReadonly();

  updateFilters(filterValue: FilterValue): void {
    this._currentFilters.update((filters) => {
      const updatedFilters = [...filters];
      const existingIndex = updatedFilters.findIndex((f) => f.filterLabel === filterValue.filterLabel);

      if (existingIndex >= 0) {
        updatedFilters[existingIndex] = filterValue;
      } else {
        updatedFilters.push(filterValue);
      }

      return updatedFilters.filter(Boolean);
    });
  }

  removeFilter(filterValue: FilterValue): void {
    this._currentFilters.update((filters) => filters.filter((f) => f.filterLabel !== filterValue.filterLabel));
  }
}
