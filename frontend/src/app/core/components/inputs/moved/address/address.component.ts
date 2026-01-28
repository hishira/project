import { NgIf } from '@angular/common';
import { Component, Input, OnDestroy, OnInit, ChangeDetectionStrategy, inject, input, computed } from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  ValidationErrors,
  Validator,
  ValidatorFn,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';
import { Subscription, noop } from 'rxjs';
import { SelectableComponent, SelectableConfig } from '../selectable/selectable.component';
import { companyZones, zones } from './consts';
import { DefaultErrors, ErrorsComponent } from '../errors/errors.component';
import { AddressFormGroup, ObjectValidators } from './types';
import { LabelFloatDirective } from '../../../../directives/label-float.directive';

@Component({
  selector: 'crm-address',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: AddressComponent,
      multi: true,
    },
    { provide: NG_VALIDATORS, useExisting: AddressComponent, multi: true },
  ],
  standalone: true,
  imports: [
    MatInputModule,
    ReactiveFormsModule,
    SelectableComponent,
    MatFormFieldModule,
    FormsModule,
    MatGridListModule,
    ErrorsComponent,
    LabelFloatDirective
  ],
})
export class AddressComponent
  implements ControlValueAccessor, OnDestroy, OnInit, Validator
{
  readonly outlineControl = input<boolean>(false)
  readonly addressValidatorObject = input.required<ObjectValidators>();
  readonly controlType = computed(()=>this.outlineControl() ? 'outline': 'fill');
  addressFormGroup!: FormGroup<AddressFormGroup>;

  readonly DefaultAddressErrors = DefaultErrors;
  subscription: Subscription = new Subscription();
  onChange: (val: any) => void = noop;
  onTouch: () => void = noop;

  selectableConfig: SelectableConfig = {
    itemType: 'object',
    dataProperty: 'value',
    viewProperty: 'viewValue'
  }
  readonly zones: (string | object)[] = companyZones;//zones.map((zone) => zone.name);
  readonly formBuilder = inject(FormBuilder);

  ngOnInit(): void {
    this.addressFormGroup = this.formBuilder.group<AddressFormGroup>({
      street: new FormControl(null, this.addressValidatorObject()?.street ?? []),
      postalCode: new FormControl('', this.addressValidatorObject()?.postalCode ?? []),
      city: new FormControl('', this.addressValidatorObject()?.city ?? []),
      zone: new FormControl('', this.addressValidatorObject()?.zone ?? []),
      region: new FormControl('', this.addressValidatorObject()?.region ?? []),
      country: new FormControl('', this.addressValidatorObject()?.country ?? []),
      secondAddress: new FormControl('', this.addressValidatorObject()?.secondAddress ?? []),
    });
    this.subscription.add(
      this.addressFormGroup.valueChanges.subscribe((_) => this.onChange(_))
    );
  }

  validate(control: AbstractControl<any, any>): ValidationErrors | null {
    return this.addressFormGroup.invalid ? { addressError: true } : null;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  writeValue(obj: any): void {
    this.addressFormGroup.patchValue(obj);
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    //throw new Error('Method not implemented.');
  }
}
