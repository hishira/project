import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { GenericEditComponent } from '../../../core/components/inputs/moved/generic-edit/generic-edit.component';
import { CommonModal } from '../../../core/components/modal/modal-common.component';
import { AddressDTO } from '../../../core/mocks/user.mocks';
import { editUserGeneralInfoDefinition } from './consts';

export type EditUserGeneralInformationDataProps = {
  name?: string;
  lastName?: string;
  address: AddressDTO;
}
@Component({
  selector: 'app-edit-user-general-information',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './edit-user-general-information.html',
  styleUrl: './edit-user-general-information.scss',
  imports: [GenericEditComponent, MatButtonModule, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose],
})
export class EditUserGeneralInformation extends CommonModal<EditUserGeneralInformationDataProps> {
  // eslint-disable-next-line complexity
  readonly genericEditFormGroup = new FormGroup({
    test: new FormGroup({
      name: new FormControl(this.data?.name ?? ''),
      lastName: new FormControl(this.data?.lastName ?? ''),
      address: new FormGroup({
        street: new FormControl(this.data?.address?.street ?? null),
        postalCode: new FormControl(this.data?.address?.postalCode ?? null),
        city: new FormControl(this.data?.address?.city ?? null),
        zone: new FormControl(this.data?.address?.city ?? null),
        region: new FormControl(this.data?.address?.country ?? null),
        country: new FormControl(this.data?.address?.country ?? null),
        secondAddress: new FormControl(this.data?.address?.city ?? null),

      })
    })
  });
  editUserGeneralInfoDefinition = editUserGeneralInfoDefinition;

  editForm(): void {
    console.log(this.data);
    console.log('HI');
  }
}
