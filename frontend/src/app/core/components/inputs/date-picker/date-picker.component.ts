import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { BaseInputComponent } from "../base-input/base-input.component";

@Component({
    selector: 'app-date-picker',
    templateUrl: './date-picker.component.html',
    standalone: true,
    imports: [MatFormFieldModule, MatDatepickerModule, MatInputModule, ReactiveFormsModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatePickerComponent extends BaseInputComponent<FormControl>{
    readonly label = input<string>('Choose a date');
    readonly hint = input<string>('MM/DD/YYYY');
    override prepareControl(): void {
        this.control = new FormControl(null);
    }
}