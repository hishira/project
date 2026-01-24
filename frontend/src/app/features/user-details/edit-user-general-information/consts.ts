import { Validators } from "@angular/forms";
import { GenericEdit } from "../../../core/components/inputs/moved/generic-edit/types";

export const editUserGeneralInfoDefinition: GenericEdit = {
    group: {
        label: 'Edit general information',
        groupName: 'test'
    },
    rowHeight: '200px',
    inputs: [
        {
            type: 'text',
            validators: [],
            formControlName: 'name',
            label: 'Name',
            placeholder: 'Enter name',
            cols: '2'
        },
        {
            type: 'text',
            validators: [],
            formControlName: 'lastName',
            label: 'Last name',
            placeholder: 'Enter last name',
            cols: '2'
        },
         {
        type: 'address',
        validators: [],
        formControlName: 'address',
        addressObjectValidator: {
          street: [Validators.required],
          city: [Validators.required],
          country: [Validators.required],
        },
        label: '',
        placeholder: '',
        cols: '4',
      },
    ]
}