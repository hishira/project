/**
 * Company-related configuration and constants.
 * This file should be moved to a more appropriate location like shared/constants.
 * Currently in auth module but contains business domain data unrelated to authentication.
 */
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

const NORMAL_INPUT_HEIGHT = '100px';

export const COMPANY_GROUPS = ['supplier', 'other', 'customer', 'manager'] as const;

export const COMPANY_ACCESS_LEVELS = [
  { id: '0', value: 'Publiczny' },
  { id: '1', value: 'Publiczny, tylko do odczyty' },
  { id: '2', value: 'Prywatny' },
] as const;

export const SERVICE_BRANCHES = ['Legnica', 'Krakow', 'Warszawa'] as const;

export const COMPANY_STATUS_OPTIONS = [
  { key: '0', value: 'Nowy' },
  { key: '1', value: 'Oczekiwany komentarz' },
  { key: '2', value: 'Otwarte' },
  { key: '3', value: 'Rozwiązane' },
  { key: '4', value: 'W trakcie' },
  { key: '5', value: 'Wstrzymany' },
  { key: '6', value: 'Zamknięty' },
] as const;

export const COMPANY_ADDITIONAL_SERVICES = [
  { key: 'GUS', value: 'Sprawozdznia do GUS' },
  { key: 'Prawo', value: 'Doradztwo prawne' },
  { key: 'Pulpit', value: 'Pulpit managera' },
  { key: 'Sprawozdanie', value: 'Sprawozdzanie roczne' },
] as const;

/**
 * Returns generic company edit form configuration.
 * Note: This is a factory function that returns array configuration for dynamic forms.
 */
export function createCompanyGenericEditConfiguration(): Record<string, any>[] {
  return [
    {
      group: {
        label: 'Informacje ogólne',
        groupName: 'general',
      },
      rowHeight: NORMAL_INPUT_HEIGHT,
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
  ];
}
