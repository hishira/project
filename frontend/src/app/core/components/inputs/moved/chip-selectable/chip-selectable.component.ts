import { Component, Input, OnDestroy, OnInit, ChangeDetectionStrategy, input } from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormControl,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
  ValidatorFn,
} from '@angular/forms';
import { Subscription, noop } from 'rxjs';
import { ChipDefaultValues, Imports } from './consts';
import { ChipSelectableType } from './types';

//TODO: First way of implement multiselecting
@Component({
  selector: 'crm-chip-selectable',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './chip-selectable.component.html',
  styleUrls: ['./chip-selectable.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: ChipSelectableComponent,
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: ChipSelectableComponent,
      multi: true,
    },
  ],
  standalone: true,
  imports: Imports,
})
export class ChipSelectableComponent
  implements ControlValueAccessor, OnInit, OnDestroy, Validator {
  //TODO: Make more generic
  readonly selectableValues = input<ChipSelectableType[]>(ChipDefaultValues);
  readonly validators = input<ValidatorFn[]>([]);
  readonly label = input<string>('');
  selectedChipValues: string[] = [];
  valueControl!: FormControl<string[] | ChipSelectableType[]>;
  subscription: Subscription = new Subscription();
  onChange: (value: unknown) => void = noop;
  onTouch: () => void = noop;

  validate(control: AbstractControl<any, any>): ValidationErrors | null {
    let errors = {};
    this.validators()?.forEach((validator) => {
      errors = validator(this.valueControl) ?? {};
    });
    return errors ?? null;
  }
  ngOnInit(): void {
    this.valueControl = new FormControl<string[] | ChipSelectableType[]>(
      [],
      {
        nonNullable: true,
        validators: this.validators() ?? [],
      }
    );
    this.subscription.add(
      this.valueControl.valueChanges.subscribe(
        (value: string[] | ChipSelectableType[]) => {
          const mappedValues = this.mappedSelectedValues(value);
          if (Array.isArray(value) && Array.isArray(mappedValues)) { this.selectedChipValues = mappedValues; }
          this.onChange(value);
        }
      )
    );
  }

  mappedSelectedValues(value: string[] | ChipSelectableType[]): any[] {
    return Array.isArray(value)
      ? value.map((t) =>
        typeof t === 'object'
          ? (t as any)?.viewData
          : this.selectableValues().find((a) => a.value === t)?.viewData
      )
      : value;
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  removeKeyword(keyword: string): void {
    const index = this.selectedChipValues.indexOf(keyword);
    if (index >= 0) {
      this.selectedChipValues.splice(index, 1);
    }
    this.valueControl.setValue(this.selectedChipValues);
  }
  writeValue(obj: any): void {
    this.valueControl.setValue(obj);
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    isDisabled ? this.valueControl.disable() : this.valueControl.enable();
  }
}
