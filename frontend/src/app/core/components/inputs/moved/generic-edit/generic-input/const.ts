import { FormControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import { StrategyValidateFunction } from "./types";

export const DefaultFunction: StrategyValidateFunction = (
  formControl: FormControl,
  validators?: ValidatorFn[]
): ValidationErrors | null => {
  let mainErrors = {};
  validators?.forEach((validator) => {
    const errors = validator(formControl);
    //TODO: fix => mainErrors = {...mainErrors, ...errors}
    mainErrors = { ...errors };
  });
  return mainErrors;
};
export const GenericInputDefaultStrategy = {
  address: (formControl: FormControl) => {
    const errors = formControl.errors;
    return errors;
  },
  'chip-selectable': DefaultFunction,
  autocomplete: DefaultFunction,
  date: DefaultFunction,
  email: DefaultFunction,
  number: DefaultFunction,
  password: DefaultFunction,
  selectable: DefaultFunction,
  text: DefaultFunction,
};
