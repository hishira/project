import { ChangeDetectionStrategy, Component, computed, input, Input, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormControl,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  ValidationErrors,
  Validator,
} from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { Subscription, noop } from 'rxjs';

import { GenericInput } from '../types';
import { DefaultFunction, GenericInputDefaultStrategy } from './const';
import {
  GenericInputValidationStrategy,
  StrategyValidateFunction,
} from './types';
import {
  AddressComponent, AutocompleteComponent, ChipSelectableComponent, NumberDirective, DefaultErrors, ErrorsComponent, MutliSelectWithSearchComponent, DefaultSelectableConfig,
  SelectableComponent,
} from 'common-forms';
@Component({
  selector: 'crm-generic-input',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './generic-input.component.html',
  styleUrls: ['./generic-input.scss'],
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: GenericInputComponent,
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: GenericInputComponent,
      multi: true,
    },
    provideNativeDateAdapter()
  ],
  imports: [
    AddressComponent,
    ReactiveFormsModule,
    MatInputModule,
    MatDatepickerModule,
    SelectableComponent,
    NumberDirective,
    AutocompleteComponent,
    ChipSelectableComponent,
    ErrorsComponent,
    MutliSelectWithSearchComponent,
  ],
})
export class GenericInputComponent
  implements OnInit, ControlValueAccessor, OnDestroy, Validator {
  readonly genericInput = input.required<GenericInput>()
  readonly inputApprearance = computed(() => this.genericInput().outlineControl ? 'outline' : 'fill')
  formControl!: FormControl;
  subscription: Subscription = new Subscription();
  DefaultAddressErrors = DefaultErrors;
  onChange: (value: unknown) => void = noop;
  onTouch: () => void = noop;
  defaultFunction: StrategyValidateFunction = DefaultFunction;

  DefaultSelectableConfig = DefaultSelectableConfig;
  validationStrategy: GenericInputValidationStrategy =
    GenericInputDefaultStrategy;

  ngOnInit(): void {
    this.formControl = new FormControl(null, this.genericInput().validators);
    this.subscription.add(
      this.formControl.valueChanges.subscribe((formValue) => {
        this.onChange(formValue);
      })
    );
  }

  validate(_: AbstractControl): ValidationErrors | null {
    const mainErrors = this.validationStrategy[this.genericInput().type]?.(
      this.formControl,
      this.genericInput()?.validators ?? []
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
