import { ChangeDetectionStrategy, Component } from "@angular/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";

@Component({
    selector: 'app-date-range-picker',
    templateUrl: './date-range-picker.component.html',
    standalone: true,
    imports: [MatFormFieldModule, MatDatepickerModule, MatInputModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DateRangePickerComponent{}