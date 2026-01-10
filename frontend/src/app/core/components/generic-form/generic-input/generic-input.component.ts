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
  imports: [],
});
export class GenericInputComponent implements OnInit, ControlValueAccessor, OnDestroy, Validator {
  readonly inputType = input.required<GenericInputType>();
  readonly genericInput = input.required<GenericInput>();
  formControl!: FormControl;
  subscription: Subscription = new Subscription();
  onChange: (value: unknown) => void = noop;
  onTouch: () => void = noop;
  defaultFunction: StrategyValidateFunction = DefaultFunction;

  //DefaultSelectableConfig = DefaultSelectableConfig;
  validationStrategy: GenericInputValidationStrategy = GenericInputDefaultStrategy;

  ngOnInit(): void {
    this.formControl = new FormControl(null, this.genericInput().validators);
    this.subscription.add(
      this.formControl.valueChanges.subscribe((formValue) => {
        this.onChange(formValue);
      }),
    );
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
  writeValue(obj: unknown): void {
    this.formControl.setValue(obj);
  }
  registerOnChange(fn: (val: unknown) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouch = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    isDisabled ? this.formControl.disable() : this.formControl.enable();
  }
}
