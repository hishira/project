import { NgFor } from '@angular/common';
import { Component, input, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { GenericGroupComponent } from './generic-group/generic-group.component';
import { GenericEdit } from './types';

@Component({
  selector: 'crm-generic-edit',
  templateUrl: './generic-edit.component.html',
  standalone: true,
  imports: [NgFor, GenericGroupComponent],
})
export class GenericEditComponent {
  readonly genericEditInfo = input.required<GenericEdit[]>();
  readonly formGroup = input.required<FormGroup>();
  //
  // @Input() genericEditInfo!: GenericEdit[];
  // @Input() formGroup!: FormGroup;

  getGroupname(groupName: string): FormGroup {
    return this.formGroup().get(groupName) as FormGroup;
  }
}
