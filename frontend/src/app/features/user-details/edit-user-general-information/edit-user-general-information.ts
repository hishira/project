import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { CommonModal } from '../../../core/components/modal/modal-common.component';
import { AddressDTO } from '../../../core/mocks/user.mocks';
import { createEditUserFormGroup, editUserGeneralInfoDefinition } from './consts';
import {GenericForm} from 'generic-form'
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
  imports: [MatButtonModule, MatDialogContent, MatDialogActions, MatDialogClose, GenericForm],
})
export class EditUserGeneralInformation extends CommonModal<EditUserGeneralInformationDataProps> {
  readonly genericEditFormGroup = createEditUserFormGroup(this.data)
  editUserGeneralInfoDefinition = editUserGeneralInfoDefinition;

  editForm(): void {
    console.log(this.data);
  }
}
