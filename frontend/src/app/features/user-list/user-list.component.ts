import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
    selector: "app-user-list",
    templateUrl: './user-list.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [],
})
export class UserListComponent{}