import { ValidatorFn } from '@angular/forms';
import { FetchingAutoCompleteSerivce } from '../autocomplete/autocomplete.component';
import { SelectableConfig } from '../selectable/selectable.component';
import { ObjectValidators } from '../address/types';

export type GenericInputType =
  | 'email'
  | 'number'
  | 'selectable'
  | 'text'
  | 'password'
  | 'date'
  | 'address'
  | 'autocomplete'
  | 'chip-selectable'
  | 'multi-search-select';
export type GenericInput = {
  type: GenericInputType;
  validators?: ValidatorFn[];
  addressObjectValidator?: ObjectValidators;
  formControlName: string;
  label: string;
  useSelectablePipe?: boolean;
  selectablePipeModule?: string;
  placeholder: string;
  selectableValues?: (string | Record<string, any>)[];
  selectableConfig?: SelectableConfig;
  fetchingService?: FetchingAutoCompleteSerivce;
  cols: '2' | '4';
  usingNormal?: boolean
};
export type GenericEdit = {
  group: {
    label: string;
    tooltip?: string;
    groupName: string;
  };
  rowHeight: string;
  inputs: GenericInput[];
};
