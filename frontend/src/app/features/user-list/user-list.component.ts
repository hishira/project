import { ChangeDetectionStrategy, Component, computed, inject, Signal, signal } from "@angular/core";
import { usersListMocks } from "../../core/mocks/user.mocks";
import { MatTableModule } from "@angular/material/table";
import { toSignal } from "@angular/core/rxjs-interop";
import { Store } from "@ngrx/store";
import { userSelector } from "../../store/user";
import { User } from "../../shared/models/auth.model";
const adminColumns = ['id', 'firstName', 'lastName', 'email', 'role', 'state'];
const otherColumns = ['firstName', 'lastName', 'email', 'role']
@Component({
    selector: "app-user-list",
    templateUrl: './user-list.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [MatTableModule],
    styleUrl: './user-list.component.scss'
})
export class UserListComponent{
    readonly users = signal(usersListMocks)
     readonly user: Signal<User | any> = toSignal(inject(Store).select(userSelector));
    readonly columns: Signal<string[]> = computed(()=>this.user()?.role?.roleType?.roleType === 'admin' ? adminColumns : otherColumns);

}