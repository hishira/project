import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GenericEditComponent } from '../../../core/components/inputs/moved/generic-edit/generic-edit.component';
import { FormControl, FormGroup } from '@angular/forms';
import { editUserGeneralInfoDefinition } from './consts';

@Component({
  selector: 'app-edit-user-general-information',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './edit-user-general-information.html',
  styleUrl: './edit-user-general-information.scss',
  standalone: true, 
  imports: [GenericEditComponent],
})
export class EditUserGeneralInformation {
  readonly genericEditFormGroup = new FormGroup({
    test: new FormGroup({
      name: new FormControl(''),
      lastName: new FormControl(''),
      address: new FormControl('')
    })
  });
  editUserGeneralInfoDefinition = editUserGeneralInfoDefinition;
}
