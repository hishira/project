import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  Signal,
} from '@angular/core';
import { Filter, FilterOption, SelectableFilterConfig } from '../../types';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-selectable-filter',
  templateUrl: './selectable-filter.component.html',
  standalone: true,
  imports: [MatSelectModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectableFilterComponent {
  readonly filter = input.required<Filter>();
  readonly label = computed(() => this.filter().label);
  readonly config = computed(() => this.filter().config as SelectableFilterConfig);
  readonly selectableOptions: Signal<FilterOption[]> = computed(
    () => this.config().options,
  );
}
