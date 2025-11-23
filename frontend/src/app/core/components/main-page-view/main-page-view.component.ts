import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
    selector: "app-main-page-view",
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: "./main-page-view.component.html",
    styleUrl: "./main-page-view.component.scss",
    standalone: true,
    imports: [CommonModule]

})
export class MainPageViewComponent {}