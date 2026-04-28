import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { AbstractControl, FormControl, ValidationErrors, Validator, ValidatorFn } from '@angular/forms';
import { GenericInput, GenericInputType } from '../types';
import { TextInputComponent } from '../../inputs/text-input/text-input.component';

export type StrategyValidateFunction = (
  formControl: FormControl,
  validators?: ValidatorFn[],
) => ValidationErrors | null;
export type GenericInputValidationStrategy = {
  [type in GenericInputType]?: StrategyValidateFunction;
};

export const DefaultFunction: StrategyValidateFunction = (
  formControl: FormControl,
  validators?: ValidatorFn[],
): ValidationErrors | null => {
  let mainErrors: ValidationErrors = {};
  validators?.forEach((validator) => {
    const errors = validator(formControl) ?? {};
    mainErrors = { ...mainErrors, ...errors };
  });
  return Object.keys(mainErrors).length ? mainErrors : null;
};
export const GenericInputDefaultStrategy = {
  //   address: (formControl: FormControl) => {
  //     const errors = formControl.errors;
  //     return errors;
  //   },
  'chip-selectable': DefaultFunction,
  autocomplete: DefaultFunction,
  date: DefaultFunction,
  email: DefaultFunction,
  number: DefaultFunction,
  password: DefaultFunction,
  selectable: DefaultFunction,
  text: DefaultFunction,
};

@Component({
  selector: 'app-generic-input',
  templateUrl: './generic-input.component.html',
  styleUrls: ['./generic-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [TextInputComponent],
})
export class GenericInputComponent implements Validator {
  readonly control = input.required<FormControl>();
  readonly inputType = input.required<GenericInputType>();
  readonly genericInput = input.required<GenericInput>();
  readonly validationStrategy: GenericInputValidationStrategy = GenericInputDefaultStrategy;

  validate(_: AbstractControl): ValidationErrors | null {
    const mainErrors = this.validationStrategy[this.genericInput().type]?.(
      this.control(),
      this.genericInput()?.validators ?? [],
    );

    return mainErrors ?? null;
  }
}
