import { Directive } from '@angular/core';
import { AbstractControl, ControlValueAccessor } from '@angular/forms';

@Directive({
  standalone: true,
})
export abstract class BaseInputComponent<T extends AbstractControl> implements ControlValueAccessor {
  protected control!: T;

  abstract prepareControl(): void;

  onChange!: (value: any) => {};

  constructor() {
    this.prepareControl();
    this.control.valueChanges.subscribe((val) => this?.onChange?.(val));
  }
  writeValue(obj: any): void {
    this.control.setValue(obj);
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    //throw new Error("Method not implemented.");
  }
  setDisabledState?(isDisabled: boolean): void {
    //throw new Error("Method not implemented.");
  }
}
