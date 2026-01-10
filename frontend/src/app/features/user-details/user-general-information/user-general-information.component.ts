import { ChangeDetectionStrategy, Component, computed, input, Signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ReadonlyOnlyComponent } from '../../../core/components/read-only/read-only.component';
import { UserMock, UserMockCredentials } from '../../../core/mocks/user.mocks';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-user-general-information',
  templateUrl: './user-general-information.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatCardModule, ReadonlyOnlyComponent, MatButtonModule],
})
export class UserGeneralInformationComponent {
  readonly user = input.required<UserMock>();
  readonly userCredentials: Signal<UserMockCredentials> = computed(() => this.user().credentials);
  readonly currentAddress: Signal<string> = computed(() => {
    const address = this.user().address;
    return `${address.houseNumber} ${address.street}, ${address.city}, ${address.postalCode}, ${address.country}`;
  });
}
