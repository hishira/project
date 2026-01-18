import { ChangeDetectionStrategy, Component, input, OnDestroy, OnInit } from '@angular/core';
import {
    AbstractControl,
    ControlValueAccessor,
    FormControl,
    ValidationErrors,
    Validator,
    ValidatorFn,
} from '@angular/forms';
import { noop, Subscription } from 'rxjs';
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
  let mainErrors = {};
  validators?.forEach((validator) => {
    const errors = validator(formControl);
    //TODO: fix => mainErrors = {...mainErrors, ...errors}
    mainErrors = { ...errors };
  });
  return mainErrors;
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
Component({
  selector: 'app-generic-input',
  template: './generic-input.component.html',
  styleUrl: './generic-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [TextInputComponent],
});
export class GenericInputComponent implements OnInit, OnDestroy, Validator {
  readonly control = input.required<FormControl>();
  readonly inputType = input.required<GenericInputType>();
  readonly genericInput = input.required<GenericInput>();
  formControl!: FormControl;
  subscription: Subscription = new Subscription();
  defaultFunction: StrategyValidateFunction = DefaultFunction;

  //DefaultSelectableConfig = DefaultSelectableConfig;
  validationStrategy: GenericInputValidationStrategy = GenericInputDefaultStrategy;

  ngOnInit(): void {
    this.formControl = new FormControl(null, this.genericInput().validators);
  }

  validate(_: AbstractControl): ValidationErrors | null {
    const mainErrors = this.validationStrategy[this.genericInput().type]?.(
      this.formControl,
      this.genericInput()?.validators ?? [],
    );

    return mainErrors ?? null;
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
 
}
