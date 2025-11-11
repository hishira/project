import { ChangeDetectionStrategy, Component, forwardRef, input } from '@angular/core';
import { FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BaseInputComponent } from '../base-input/base-input.component';

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  standalone: true,
  imports: [MatFormFieldModule, MatDatepickerModule, MatInputModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatePickerComponent),
      multi: true,
    },
  ],
})
export class DatePickerComponent extends BaseInputComponent<FormControl> {
  readonly label = input<string>('Choose a date');
  readonly hint = input<string>('MM/DD/YYYY');

  override prepareControl(): void {
    this.control = new FormControl(null);
  }

  override valueMapper(value: unknown): string {
    if(value instanceof Date) {
      return value.toISOString().split('T')[0];
    }
    return value ? String(value) : value as string;
  }
}
