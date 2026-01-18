import { ChangeDetectionStrategy, Component, effect, forwardRef, input } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  ValidationErrors,
  Validator
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BaseInputComponent } from '../base-input/base-input.component';
import { PasswordInputComponent } from './password-input/password-input.component';
type ErrorsMap = {
  [key: string]: string;
};

@Component({
  selector: 'app-text-input',
  templateUrl: './text-input.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatIconModule, ReactiveFormsModule, PasswordInputComponent],
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
  //ngControl: ControlContainer  = inject(ControlContainer , {self: true, optional: true})!;
  
  get Control() {
    return this.control;
  }

  constructor(
    // eslint-disable-next-line @angular-eslint/prefer-inject
  //  @Self() @Optional() public ngControl: NgControl,
  ) {
    super();

    // if (this.ngControl) {
    //   this.ngControl.valueAccessor = this;
    //   //this.control = this.ngControl.control as FormControl;
    // }
    effect(() => {
      this.control?.reset();
      const validators =
        this.inputValidation()
          ?.map((v) => v.validator)
          ?.filter((v) => !!v) ?? [];
      const asyncValidators =
        this.inputValidation()
          ?.map((v) => v.asyncValidator)
          ?.filter((v) => !!v) ?? [];
      this.control?.setValidators(validators);
      this.control?.setAsyncValidators(asyncValidators);
      this.control?.updateValueAndValidity();
    });
  }

  override prepareControl(): void {
    this.control = new FormControl(null);
  }

  protected override onInit(): void {
    // this.control.events.subscribe(() => {
    //   this.inputValidation().forEach((validation) => {
    //     if (this.control.hasError(validation.name) && validation.message) {
    //       //this.errorsMessage.add(validation.message);
    //     }
    //   });
    // });
    // const validators$ = this.control.valueChanges.pipe().subscribe(a=>{
    //   console.log(a)
    //   this.validate(this.ngControl.control!)
    // });
  }
  validate(control: AbstractControl): ValidationErrors | null {
    // console.log('TOUCHED', this.control.touched);
    // console.log(control?.validator)
    // if(!this.control.dirty) return null;
    // this.control.clearValidators();
    // // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    // control?.validator && this.control.addValidators([control.validator!]);
    // this.control.updateValueAndValidity();
    return this.control.errors;
  }
}
