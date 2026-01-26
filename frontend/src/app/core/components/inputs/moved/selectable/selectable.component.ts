import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, computed, input } from '@angular/core';
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
import { Imports } from './consts';

export type SelectableConfig = {
  itemType: 'string' | 'object';
  viewProperty: string | null;
  dataProperty: string | null;
};

export const DefaultSelectableConfig: SelectableConfig = {
  itemType: 'string',
  viewProperty: null,
  dataProperty: null,
};
//TODO: validacja
@Component({
  selector: 'crm-selectable',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './selectable.component.html',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: SelectableComponent,
      multi: true,
    },
    { provide: NG_VALIDATORS, useExisting: SelectableComponent, multi: true },
  ],
  imports: Imports,
})
export class SelectableComponent
  implements ControlValueAccessor, OnInit, OnDestroy, Validator {

  readonly values = input<(string | Record<string, any>)[]>([]);
  readonly label = input<string>('');
  readonly usePipe = input<boolean>(false);;
  readonly pipeModule = input<string | undefined>(undefined);
  readonly validators = input<ValidatorFn[]>([]);
  readonly selectableConfig = input<SelectableConfig>(DefaultSelectableConfig);
  readonly outlineControl = input<boolean>(false);
  
  readonly controlAppearance = computed(()=>this.outlineControl() ? 'outline' : 'fill')
  
  valueControl!: FormControl<string | null>;
  subscription: Subscription = new Subscription();
  mappedValues: { value: any; viewData: string }[] = [];
  
  onChange: (val: any) => void = noop;
  onTouch: () => void = noop;

  static isObjectTypeInValues(
    selectableConfig: SelectableConfig | undefined,
    value: string | Record<string, any>
  ): boolean {
    return (
      selectableConfig?.itemType === 'object' &&
      typeof value === 'object' &&
      selectableConfig?.dataProperty !== null &&
      selectableConfig?.viewProperty !== null
    );
  }
  validate(_: AbstractControl): ValidationErrors | null {
    let errors = {};
    this.validators()?.forEach((validator) => {
      errors = validator(this.valueControl) ?? {};
    });
    return errors ?? null;
  }

  ngOnInit(): void {
    this.mappedValues =
      this.values()?.map((value: string | Record<string, any>) => {
        if (
          SelectableComponent.isObjectTypeInValues(this.selectableConfig() ?? DefaultSelectableConfig, value)
        ) {
          // type sh*t, isObject check is value is object and propertis are not null :| but we must do this
          return {
            value: (value as Record<string, any>)[
              this.selectableConfig().dataProperty as string
            ],
            viewData: (value as Record<string, any>)[
              this.selectableConfig().viewProperty as string
            ],
          };
        }
        return {
          value,
          viewData: value,
        };
      }) ?? [];
    this.valueControl = new FormControl<string | null>(null, {
      nonNullable: true,
      validators: this.validators(),
    });
    this.subscription.add(
      this.valueControl.valueChanges.subscribe((_) => {
        this.onChange(_);
      })
    );
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  writeValue(obj: string): void {
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
