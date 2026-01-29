import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { GenericEditComponent } from '../../../core/components/inputs/moved/generic-edit/generic-edit.component';
import { CommonModal } from '../../../core/components/modal/modal-common.component';
import { editUserGeneralInfoDefinition } from './consts';

export type EditUserGeneralInformationDataProps = {
  name?: string;
  lastName?: string;
  address: any;
}
@Component({
  selector: 'app-edit-user-general-information',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './edit-user-general-information.html',
  styleUrl: './edit-user-general-information.scss',
  imports: [GenericEditComponent, MatButtonModule, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose],
})
export class EditUserGeneralInformation extends CommonModal<EditUserGeneralInformationDataProps> {
  readonly genericEditFormGroup = new FormGroup({
    test: new FormGroup({
      name: new FormControl(this.data?.name ?? ''),
      lastName: new FormControl(this.data?.lastName ?? ''),
      address: new FormControl('')
    })
  });
  editUserGeneralInfoDefinition = editUserGeneralInfoDefinition;

  editForm(): void {
    console.log(this.data);
    console.log('HI');
  }
}
