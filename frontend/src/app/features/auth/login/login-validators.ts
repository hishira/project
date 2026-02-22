import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { inject } from "@angular/core";

export const loginValidators = {
    login: [{
        name: 'required',
        validator: Validators.required,
        message: 'Email or username is required'
    }],
    password: [{
        name: 'required',
        validator: Validators.required,
        message: 'Password is required'
    }]
}

type StatsType = {
  key: string;
  value: string;
};
const NormalInputHeight = '100px';
export const groups: string[] = ['supplier', 'other', 'customer', 'manager'];
export const access: object[] = [
  { id: '0', value: 'Publiczny' },
  { id: '1', value: 'Publiczny, tylko do odczyty' },
  { id: '2', value: 'Prywatny' },
];
export const serviceBranch: string[] = ['Legnica', 'Krakow', 'Warszawa'];
export const stats: StatsType[] = [
  { key: '0', value: 'Nowy' },
  { key: '1', value: 'Oczekiwany komentarz' },
  { key: '2', value: 'Otwarte' },
  { key: '3', value: 'Rozwiązane' },
  { key: '4', value: 'W trakcie' },
  { key: '5', value: 'Wstrzymany' },
  { key: '6', value: 'Zamknięty' },
];
export const additionalThings: object[] = [
  { key: 'GUS', value: 'Sprawozdznia do GUS' },
  { key: 'Prawo', value: 'Doradztwo prawne' },
  { key: 'Pulpit', value: 'Pulpit managera' },
  { key: 'Sprawozdanie', value: 'Sprawozdzanie roczne' },
];

export const CompanyGenericEdit: (
 ) => any[] = () => [
  {
    group: {
      label: 'Informacje ogólne',
      groupName: 'general',
    },
    rowHeight: NormalInputHeight,
    inputs: [
      {
        type: 'text',
        validators: [Validators.required],
        formControlName: 'companyName',
        label: 'Nazwa firmy',
        placeholder: '',
        cols: '2',
      },
      {
        type: 'text',
        validators: [],
        formControlName: 'shortName',
        label: 'Krótka nazwa',
        placeholder: '',
        cols: '2',
      },
      {
        type: 'text',
        validators: [Validators.email],
        formControlName: 'email',
        label: 'E-mail',
        placeholder: '',
        cols: '2',
      },
      {
        type: 'date',
        validators: [],
        formControlName: 'agreementDate',
        label: 'Data zawarcia umowy',
        placeholder: '',
        cols: '2',
      },
      {
        type: 'number',
        validators: [Validators.required],
        formControlName: 'limit',
        label: 'Limit dokumentów',
        placeholder: '',
        cols: '2',
      },
      {
        type: 'number',
        validators: [Validators.required],
        formControlName: 'phone',
        label: 'Numer telefonu',
        placeholder: '',
        cols: '2',
      },
     
    ],
  },
  {
    group: {
      label: 'Address',
      groupName: 'address',
    },
    rowHeight: '350px',
    inputs: [
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
    ],
  },
  {
    group: {
      label: 'Dodatkowe infromacje',
      groupName: 'additionalInfo',
    },
    rowHeight: NormalInputHeight,
    inputs: [
      {
        type: 'text',
        validators: [],
        formControlName: 'webAddress',
        label: 'Adress www',
        placeholder: '',
        cols: '2',
      },
      {
        type: 'selectable',
        validators: [],
        formControlName: 'group',
        label: 'Grupa',
        placeholder: '',
        cols: '2',
        useSelectablePipe: true,
        selectablePipeModule: 'group',
        selectableValues: groups,
      },
      {
        type: 'selectable',
        validators: [Validators.required],
        formControlName: 'access',
        label: 'Dostęp',
        placeholder: '',
        cols: '2',
        useSelectablePipe: false,
        selectablePipeModule: undefined,
        selectableConfig: {
          itemType: 'object',
          dataProperty: 'id',
          viewProperty: 'value',
        },
        selectableValues: access,
      },
      {
        type: 'selectable',
        validators: [Validators.required],
        formControlName: 'vat',
        label: 'Vat',
        placeholder: '',
        cols: '2',
        useSelectablePipe: false,
        selectablePipeModule: undefined,
        selectableValues: ['NIE', 'TAK'],
      },
      {
        type: 'selectable',
        validators: [],
        formControlName: 'additionalThings',
        label: 'Usługi dodatkowe w abonamencie',
        placeholder: '',
        cols: '2',
        useSelectablePipe: false,
        selectablePipeModule: undefined,
        selectableValues: additionalThings,
        selectableConfig: {
          itemType: 'object',
          dataProperty: 'key',
          viewProperty: 'value',
        },
      },
      {
        type: 'text',
        validators: [Validators.email],
        formControlName: 'invoiceEmail',
        label: 'Invoice email',
        placeholder: '',
        cols: '2',
      },
      {
        type: 'selectable',
        validators: [Validators.required],
        formControlName: 'branch',
        label: 'Odział obsługujący',
        placeholder: '',
        cols: '2',
        useSelectablePipe: false,
        selectablePipeModule: undefined,
        selectableValues: serviceBranch,
      },
      {
        type: 'selectable',
        validators: [],
        formControlName: 'status',
        label: 'Status',
        placeholder: '',
        cols: '2',
        useSelectablePipe: false,
        selectablePipeModule: undefined,
        selectableValues: stats,
        selectableConfig: {
          itemType: 'object',
          dataProperty: 'key',
          viewProperty: 'value',
        },
      },
      {
        type: 'text',
        validators: [],
        formControlName: 'assistant',
        label: 'Asystent klienta',
        placeholder: '',
        cols: '2',
      },
     
      {
        type: 'chip-selectable',
        validators: [Validators.required],
        formControlName: 'serviceTypes',
        label: 'Rodzaj usług',
        placeholder: '',
        cols: '2',
      },
     
    ],
  },
];

export const emptyFormGroup = ():FormGroup=>{
    const formBuilder = inject(FormBuilder)
    return formBuilder.group<any>({
      general: formBuilder.group<any>({
        companyName: formBuilder.control<string>('', {
          nonNullable: true,
        }),
        shortName: formBuilder.control<string>('', { nonNullable: true }),
        email: formBuilder.control<string>('', { nonNullable: true }),
        agreementDate: formBuilder.control<string>('', {
          nonNullable: true,
        }),
        phone: formBuilder.control<string>('', { nonNullable: true }),
        limit: formBuilder.control<string>('', { nonNullable: true }),
        parentCompany: formBuilder.control('', { nonNullable: true }),
      }),
      address: formBuilder.group({
        address: [null],
      }),
      additionalInfo: formBuilder.group<any>({
        webAddress: formBuilder.control<string | null>(null, {
          nonNullable: false,
        }),
        group: formBuilder.control<string | null>(null, {
          nonNullable: false,
        }),
        access: formBuilder.control<string | null>(null, {
          nonNullable: false,
        }),
        vat: formBuilder.control<string | null>(null, {
          nonNullable: false,
        }),
        additionalThings: formBuilder.control<string | null>(null, {
          nonNullable: false,
        }),
        invoiceEmail: formBuilder.control<string | null>(null, {
          nonNullable: false,
        }),
        branch: formBuilder.control<string | null>(null, {
          nonNullable: false,
        }),
        status: formBuilder.control<string | null>(null, {
          nonNullable: false,
        }),
        assistant: formBuilder.control<string | null>(null, {
          nonNullable: false,
        }),
        opiekun: formBuilder.control<string | null>(null, {
          nonNullable: false,
        }),
        serviceTypes: formBuilder.control<string[] | null>(null, {
          nonNullable: false,
        }),
        attendants: formBuilder.control<any>(null, {
          nonNullable: false,
        }),
      }),
    });
}