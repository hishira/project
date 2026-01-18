import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { GenericEdit } from "./types";

@Component({
    selector: 'app-generic-input',
    templateUrl: './generic-input.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [],
})
export class GenericFormComponent {
    readonly genericEditDescription = input.required<GenericEdit>()
}