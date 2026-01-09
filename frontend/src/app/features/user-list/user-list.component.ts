import { ChangeDetectionStrategy, Component, computed, inject, Signal, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { Store } from '@ngrx/store';
import { MainPageViewComponent } from '../../core/components/main-page-view/main-page-view.component';
import { TableFilteringComponent } from '../../core/components/table-filtering/table-filtering.component';
import { usersListMocks } from '../../core/mocks/user.mocks';
import { CommonRouterService } from '../../core/services/common-router.service';
import { User } from '../../shared/models/auth.model';
import { userSelector } from '../../store/user';
import { userFilters } from './user-list.filter';

const adminColumns = ['id', 'firstName', 'lastName', 'email', 'role', 'state'];
const otherColumns = ['firstName', 'lastName', 'email', 'role'];
@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatTableModule, TableFilteringComponent, MatCard, MatCardContent, MainPageViewComponent],
  providers: [CommonRouterService],
})
export class UserListComponent {
  readonly users = signal(usersListMocks);
  readonly user: Signal<User | any> = toSignal(inject(Store).select(userSelector));
  readonly columns: Signal<string[]> = computed(() =>
    this.user()?.role?.roleType?.roleType === 'admin' ? adminColumns : otherColumns,
  );
  readonly filters = userFilters;
  readonly commonRouter = inject(CommonRouterService);

  onRowClick(row: User): void {
    this.commonRouter.navitgateTo(['details', row.id]);
  }
}
