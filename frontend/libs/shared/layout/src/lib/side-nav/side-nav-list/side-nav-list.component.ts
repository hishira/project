import { Component, inject, output } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { SIDE_NAV_ELEMENTS, SideNavElementComponent } from "./side-nav-element/side-nav-element.component";

@Component({
    selector: 'app-side-nav-list',
    templateUrl: './side-nav-list.component.html',
    styleUrl: './side-nav-list.component.scss',
    imports: [MatIconModule, SideNavElementComponent],
})
export class SideNavListComponent {
    readonly sideNavElements = inject(SIDE_NAV_ELEMENTS);
    readonly closed = output<void>();

    close(): void {
        this.closed.emit();
    }
}