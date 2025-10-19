import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { BaseInputComponent } from "../base-input/base-input.component";
import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { MatFormField, MatSelectModule } from "@angular/material/select";

@Component({
    selector: 'app-selectable',
    templateUrl: './selectable.component.html',
    standalone: true,
    imports: [MatFormField, MatSelectModule, ReactiveFormsModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectableComponent extends BaseInputComponent<FormControl>{
    readonly label = input.required<string>()
    readonly isDisabled = input<boolean>(false)
    readonly selectableOptions = input<{label: string, value: unknown}[]>()
    override prepareControl(): void {
        this.control = new FormControl(null);
    }
}