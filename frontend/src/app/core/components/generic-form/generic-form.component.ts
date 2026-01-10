import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
    selector: 'app-generic-input',
    templateUrl: './generic-input.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [],
})
export class GenericInputComponent {}