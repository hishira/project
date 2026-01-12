import { Directive, input, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AbstractControl, ControlValueAccessor } from '@angular/forms';
import { map } from 'rxjs';
import { InputValidation } from '../types';

@Directive({
  standalone: true,
})
export abstract class BaseInputComponent<T extends AbstractControl> implements ControlValueAccessor, OnInit {
  protected control!: T;

  abstract prepareControl(): void;

  onChange!: (value: any) => {};

  constructor() {
    this.prepareControl();
    this.control.valueChanges
      .pipe(map(this.valueMapper), takeUntilDestroyed())
      .subscribe((val) => this?.onChange?.(val));
  }

  protected onInit(): void {}
  
  ngOnInit(): void {
    console.log('asd')
    this.onInit();
  }
  valueMapper(value: unknown): unknown {
    return value as T;
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
