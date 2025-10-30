import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DatePickerComponent } from '../../../inputs/date-picker/date-picker.component';
import { DateRangePickerComponent } from '../../../inputs/date-range-picker/date-range-picker.component';
import { DateFilterConfig } from '../../types';
import { BaseFilterComponent } from '../base-filter/base-filter.component';

@Component({
  selector: 'app-date-filter',
  templateUrl: './date-filter.component.html',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    MatFormFieldModule,
    MatDatepickerModule,
    MatInputModule,
    DatePickerComponent,
    DateRangePickerComponent,
    ReactiveFormsModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DateFilterComponent extends BaseFilterComponent<DateFilterConfig> {
  override saveFilterValue(value: unknown): void {
    const { value: formValue } = this.control;
    this.filterService.updateFilters({
      filterLabel: this.label(),
      value: value ?? formValue,
    });
  }
}
