import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DateFilterConfig } from '../../types';
import { BaseFilterComponent } from '../base-filter/base-filter.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DatePickerComponent } from "../../../inputs/date-picker/date-picker.component";
import { DateRangePickerComponent } from "../../../inputs/date-range-picker/date-range-picker.component";

@Component({
  selector: 'app-date-filter',
  templateUrl: './date-filter.component.html',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [MatFormFieldModule, MatDatepickerModule, MatInputModule, DatePickerComponent, DateRangePickerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DateFilterComponent extends BaseFilterComponent<DateFilterConfig> {}
