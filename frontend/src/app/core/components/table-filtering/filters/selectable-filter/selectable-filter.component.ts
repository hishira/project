import { ChangeDetectionStrategy, Component, computed, Signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SelectableComponent } from '../../../inputs/selectable/selectable.component';
import { FilterOption, SelectableFilterConfig } from '../../types';
import { BaseFilterComponent } from '../base-filter/base-filter.component';

@Component({
  selector: 'app-selectable-filter',
  templateUrl: './selectable-filter.component.html',
  standalone: true,
  imports: [SelectableComponent, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectableFilterComponent extends BaseFilterComponent<SelectableFilterConfig> {
  readonly selectableOptions: Signal<FilterOption[]> = computed(() => this.config().options);
  readonly isDisabled: Signal<boolean> = computed(() => !this.selectableOptions()?.length);
  override saveFilterValue(): void {
    const { value } = this.control;
    this.filterService.updateFilters({
      filterLabel: this.label(),
      value,
    });
  }
}
