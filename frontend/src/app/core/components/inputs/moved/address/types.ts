import { FormControl, FormGroup, ValidatorFn } from '@angular/forms';

export type AddressField =
  | 'street'
  | 'postalCode'
  | 'city'
  | 'zone'
  | 'region'
  | 'country'
  | 'secondAddress';
export type ObjectValidators = {
  [key in AddressField]?: ValidatorFn[];
};

export type ControlsOf<T extends Record<string, any>> = {
  [K in keyof T]: T[K] extends Record<any, any>
  ? FormGroup<ControlsOf<T[K]>>
  : FormControl<T[K]>;
};
export type Address = {
  street: string | null;
  postalCode: string | null;
  city: string | null;
  zone: string | null;
  region: string | null;
  country: string | null;
  secondAddress: string | null;
};

export type AddressFormGroup = ControlsOf<Address>