import { AsyncValidatorFn, ValidatorFn } from "@angular/forms";

export type InputValidation = {
    name: string;
    validator?: ValidatorFn,
    asyncValidator?: AsyncValidatorFn,
    message?: string;
}