import { ChangeDetectionStrategy, Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { ToolbarComponent } from "../../../features/dashboard/toolbar/toolbar.component";

@Component({
    selector: 'app-layout',
    templateUrl: './app-layout.component.html',
    styleUrl: './app-layout.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [RouterOutlet, ToolbarComponent],
})
export class AppLayoutComponent{}