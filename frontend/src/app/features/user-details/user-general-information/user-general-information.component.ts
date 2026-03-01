import { ChangeDetectionStrategy, Component, computed, inject, input, Signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CreateModalData } from '../../../core/components/modal/modal-common.component';
import { ReadonlyOnlyComponent } from '../../../core/components/read-only/read-only.component';
import { UserMock, UserMockCredentials } from '../../../core/mocks/user.mocks';
import { ModalService } from '../../../core/services/modal.service';
import { EditUserGeneralInformation } from '../edit-user-general-information/edit-user-general-information';

@Component({
  selector: 'app-user-general-information',
  templateUrl: './user-general-information.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatCardModule, ReadonlyOnlyComponent, MatButtonModule],
  providers: [ModalService]
})
export class UserGeneralInformationComponent {
  readonly user = input.required<UserMock>();
  readonly userCredentials: Signal<UserMockCredentials> = computed(() => this.user().credentials);
  readonly currentAddress: Signal<string> = computed(() => {
    const address = this.user().address;
    return `${address.houseNumber} ${address.street}, ${address.city}, ${address.postalCode}, ${address.country}`;
  });
  readonly modalServie: ModalService = inject(ModalService);

  openEditModal(): void {
    this.modalServie.open(EditUserGeneralInformation,
      {
        ...CreateModalData({
          name: this.user().firstName,
          lastName: this.user().lastName,
          address: this.user().address
        }),
        disableClose: true
      })
  }
}
