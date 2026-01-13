import { ChangeDetectionStrategy, Component, effect, forwardRef, Host, Injector, input, Optional } from '@angular/core';
import { AbstractControl, FormControl, FormControlName, NG_VALIDATORS, NG_VALUE_ACCESSOR, ReactiveFormsModule, ValidationErrors, Validator } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BaseInputComponent } from '../base-input/base-input.component';
type ErrorsMap = {
  [key: string]: string;
};
@Component({
  selector: 'app-text-input',
  templateUrl: './text-input.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatIconModule, ReactiveFormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextInputComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => TextInputComponent),
      multi: true,
    },
  ],
})
export class TextInputComponent extends BaseInputComponent<FormControl> implements Validator {
  readonly label = input.required<string>();
  readonly placeholder = input<string>('');
  readonly inputType = input<'text' | 'password' | 'email'>('text');
  readonly icon = input<string>('');
  readonly errorsMap = input<ErrorsMap>({});
  errorsMessage: Set<string> = new Set<string>([]);
  // eslint-disable-next-line @angular-eslint/prefer-inject
  constructor() {
    super();
    effect(()=>{
      this.control?.reset();
      const validators = this.inputValidation()?.map(v=>v.validator)?.filter(v=>!!v)??[];
      const asyncValidators = this.inputValidation()?.map(v=>v.asyncValidator)?.filter(v=>!!v)?? [];
      this.control?.setValidators(validators);
      this.control?.setAsyncValidators(asyncValidators);
      this.control?.updateValueAndValidity();
    })
  }

  override prepareControl(): void {
    this.control = new FormControl(null);
  }
  
  protected override onInit(): void {
    this.control.valueChanges.subscribe(() => {
    
      this.inputValidation().forEach((validation) => {
        if(this.control.hasError(validation.name) && validation.message){
          this.errorsMessage.add(validation.message);
        }
      })
    });
  }
  validate(control: AbstractControl): ValidationErrors | null {
    console.log(control.hasError('required'))
    if(control.hasError('required')){
      this.errorsMessage.add('This field is required');
    }
    return this.control.errors;
  }
}
