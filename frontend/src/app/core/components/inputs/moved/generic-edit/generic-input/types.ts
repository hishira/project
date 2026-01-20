import { FormControl, ValidatorFn, ValidationErrors } from '@angular/forms';
import { GenericInputType } from '../types';

export type StrategyValidateFunction = (
  formControl: FormControl,
  validators?: ValidatorFn[],
) => ValidationErrors | null;
export type GenericInputValidationStrategy = {
  [type in GenericInputType]?: StrategyValidateFunction;
};
