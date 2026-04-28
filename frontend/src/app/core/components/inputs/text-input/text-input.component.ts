import { ChangeDetectionStrategy, Component, computed, effect, forwardRef, input } from '@angular/core';
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
  readonly errorMessages = computed(() => {
    const controlErrors = this.control?.errors ?? {};

    return Object.keys(controlErrors).map((errorKey) => {
      const mappedMessage = this.errorsMap()[errorKey];
      if (mappedMessage) {
        return mappedMessage;
      }

      const errorValue = controlErrors[errorKey];
      if (errorKey === 'required') {
        return 'This field is required';
      }

      if (errorKey === 'minlength' && typeof errorValue === 'object') {
        return `Must be at least ${errorValue['requiredLength']} characters`;
      }

      if (errorKey === 'maxlength' && typeof errorValue === 'object') {
        return `Must be no more than ${errorValue['requiredLength']} characters`;
      }

      return `${errorKey} is invalid`;
    });
  });

  get Control() {
    return this.control;
  }

  constructor() {
    super();

    effect(() => {
      this.control?.reset();
      const validators =
        this.inputValidation()
          ?.map((v) => v.validator)
          ?.filter((validator): validator is NonNullable<typeof validator> => !!validator) ?? [];
      const asyncValidators =
        this.inputValidation()
          ?.map((v) => v.asyncValidator)
          ?.filter((validator): validator is NonNullable<typeof validator> => !!validator) ?? [];
      this.control?.setValidators(validators);
      this.control?.setAsyncValidators(asyncValidators);
      this.control?.updateValueAndValidity();
    });
  }

  override prepareControl(): void {
    this.control = new FormControl(null);
  }

  validate(_: AbstractControl): ValidationErrors | null {
    return this.control.errors;
  }
}
