import { ChangeDetectionStrategy, Component, computed, signal, Signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon'
import { MainPageViewComponent } from '../../core/components/main-page-view/main-page-view.component';
import { PageHeaderComponent } from '../../core/components/page-header/page-header.component';
import { ReadonlyOnlyComponent } from '../../core/components/read-only/read-only.component';
import { userMock, UserMock, UserMockCredentials } from '../../core/mocks/user.mocks';
import { AdminDirective } from './../../core/directives/admin.directive';
import { EmptyStateComponent } from '../../core/components/empty-state/empty-state.component';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatCardModule,
    ReadonlyOnlyComponent,
    MainPageViewComponent,
    PageHeaderComponent,
    MatButtonModule,
    AdminDirective,
    MatIconModule,
    EmptyStateComponent
  ],
})
export class UserDetailsComponent {
  readonly currentUser: Signal<UserMock> = signal(userMock);
  readonly userName: Signal<string> = computed(() => `${this.currentUser().firstName} ${this.currentUser().lastName}`);
  readonly currentAddress: Signal<string> = computed(() => {
    const address = this.currentUser().address;
    return `${address.houseNumber} ${address.street}, ${address.city}, ${address.postalCode}, ${address.country}`;
  });
  readonly userCredentials: Signal<UserMockCredentials> = computed(() => this.currentUser().credentials);
}
