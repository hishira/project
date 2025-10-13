import { ChangeDetectionStrategy, Component, computed, input, Signal } from "@angular/core";
import { FilterOption, SelectableFilterConfig } from "../../types";
import { MatSelectModule } from "@angular/material/select";

@Component({
    selector: 'app-selectable-filter',
    templateUrl: './selectable-filter.component.html',
    standalone: true,
    imports: [MatSelectModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectableFilterComponent{
    label = input.required<string>();
    config = input.required<SelectableFilterConfig>();
    selectableOptions: Signal<FilterOption[]> = computed(()=>this.config().options)
}