import { ChangeDetectionStrategy, Component, signal } from "@angular/core";
import { usersListMocks } from "../../core/mocks/user.mocks";
import { MatTableModule } from "@angular/material/table";
@Component({
    selector: "app-user-list",
    templateUrl: './user-list.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [MatTableModule],
    styleUrl: './user-list.component.scss'
})
export class UserListComponent{
    users = signal(usersListMocks)
}