import { Component, input } from '@angular/core';
import { GenericEdit } from './types';
import { FormGroup } from '@angular/forms';
import { GenericGroupComponent } from './generic-group/generic-group.component';

@Component({
  selector: 'lib-generic-form',
  imports: [GenericGroupComponent],
  templateUrl: './generic-form.html',
  styleUrl: './generic-form.css',
})
export class GenericForm {
   readonly genericEditInfo = input.required<GenericEdit[]>();
  readonly formGroup = input.required<FormGroup>();
  
  getGroupname(groupName: string): FormGroup {
    return this.formGroup().get(groupName) as FormGroup;
  }
}
