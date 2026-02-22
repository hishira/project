import { FormControl, FormGroup, Validators } from "@angular/forms";
import { EditUserGeneralInformationDataProps } from "./edit-user-general-information";

export const editUserGeneralInfoDefinition: any = {
    group: {
        label: 'Edit general information',
        groupName: 'test'
    },
    rowHeight: '150px',
    inputs: [
        {
            type: 'text',
            validators: [],
            formControlName: 'name',
            label: 'Name',
            placeholder: 'Enter name',
            cols: '2',
            outlineControl: true,

        },
        {
            type: 'text',
            validators: [],
            formControlName: 'lastName',
            label: 'Last name',
            placeholder: 'Enter last name',
            cols: '2',
            outlineControl: true,
        },
        {
            usingNormal: true,
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
            outlineControl: true,
        },
    ]
}

export const createEditUserFormGroup = (data: EditUserGeneralInformationDataProps) => new FormGroup({
    test: new FormGroup({
        name: new FormControl(data?.name ?? ''),
        lastName: new FormControl(data?.lastName ?? ''),
        address: new FormGroup({
            street: new FormControl(data?.address?.street ?? null),
            postalCode: new FormControl(data?.address?.postalCode ?? null),
            city: new FormControl(data?.address?.city ?? null),
            zone: new FormControl(data?.address?.city ?? null),
            region: new FormControl(data?.address?.country ?? null),
            country: new FormControl(data?.address?.country ?? null),
            secondAddress: new FormControl(data?.address?.city ?? null),

        })
    })
});