import { TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, signal, Signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { EmptyStateComponent } from '../../core/components/empty-state/empty-state.component';
import { MainPageViewComponent } from '../../core/components/main-page-view/main-page-view.component';
import { PageHeaderComponent } from '../../core/components/page-header/page-header.component';
import { ReadonlyOnlyComponent } from '../../core/components/read-only/read-only.component';
import { userMock, UserMock, UserMockCredentials } from '../../core/mocks/user.mocks';
import { AdminDirective } from './../../core/directives/admin.directive';
import { UserTypeCssClass } from './types';
import { usetTypeToCssClassMapper } from './utils';
import { UserGeneralInformationComponent } from './user-general-information/user-general-information.component';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatCardModule,
    MainPageViewComponent,
    PageHeaderComponent,
    MatButtonModule,
    AdminDirective,
    MatIconModule,
    EmptyStateComponent,
    MatChipsModule,
    TitleCasePipe,
    UserGeneralInformationComponent,
  ],
})
export class UserDetailsComponent {
  readonly currentUser: Signal<UserMock> = signal(userMock);
  readonly userName: Signal<string> = computed(() => `${this.currentUser().firstName} ${this.currentUser().lastName}`);
  readonly userRole: Signal<string> = computed(() => this.currentUser().role);
  readonly userState: Signal<string> = computed(() => this.currentUser().state);
  readonly currentStateClass: Signal<string> = computed(
    () => usetTypeToCssClassMapper[this.currentUser().state] || UserTypeCssClass.Unknown,
  );
}
