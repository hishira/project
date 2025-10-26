import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { MatChipGrid, MatChipRow } from "@angular/material/chips";

@Component({
    selector: 'app-filter-chips',
    templateUrl: './filter-chips.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [MatChipGrid, MatChipRow],
})
export class FilterChipsComponent {
    readonly filterValues = input<string[]>([]);
}