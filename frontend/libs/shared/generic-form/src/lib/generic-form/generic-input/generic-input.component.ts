import { ChangeDetectionStrategy, Component, computed, input, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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
import { noop } from 'rxjs';

import {
  AddressComponent, AutocompleteComponent, ChipSelectableComponent,
  DefaultErrors,
  DefaultSelectableConfig,
  ErrorsComponent, MutliSelectWithSearchComponent,
  NumberDirective,
  SelectableComponent,
} from 'common-forms';
import { GenericInput } from '../types';
import { DefaultFunction, GenericInputDefaultStrategy } from './const';
import {
  GenericInputValidationStrategy,
  StrategyValidateFunction,
} from './types';
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
  implements OnInit, ControlValueAccessor, Validator {
  readonly genericInput = input.required<GenericInput>()
  readonly inputAppearance = computed(() => this.genericInput().outlineControl ? 'outline' : 'fill')
  formControl!: FormControl;
  DefaultAddressErrors = DefaultErrors;
  onChange: (value: unknown) => void = noop;
  onTouch: () => void = noop;
  defaultFunction: StrategyValidateFunction = DefaultFunction;

  DefaultSelectableConfig = DefaultSelectableConfig;
  validationStrategy: GenericInputValidationStrategy =
    GenericInputDefaultStrategy;

  ngOnInit(): void {
    this.formControl = new FormControl(null, this.genericInput().validators);
    this.formControl.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe((formValue) => {
        this.onChange(formValue);
      });
  }

  validate(_: AbstractControl): ValidationErrors | null {
    const mainErrors = this.validationStrategy[this.genericInput().type]?.(
      this.formControl,
      this.genericInput()?.validators ?? []
    );

    return mainErrors ?? null;
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
