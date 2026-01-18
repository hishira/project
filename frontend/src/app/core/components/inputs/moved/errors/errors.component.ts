import { NgFor } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormGroupDirective,
  NgForm,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

type ErrorsType = 'required' | 'email';
export type ErrorsInput = {
  [key in ErrorsType]?: string;
};

type ErrorInputPossible =
  | AbstractControl
  | FormControl
  | FormGroup
  | null
  | undefined;
export const DefaultErrors: ErrorsInput = {
  required: 'To pole jest wymagane',
  email: 'Address email jest niepoprawny',
};
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form && form.submitted;
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || isSubmitted)
    );
  }
}
//TODO: Check if we can implement errors inserting like ng-content
@Component({
  selector: 'crm-errors',
  templateUrl: './errors.component.html',
  standalone: true,
  imports: [NgFor, MatInputModule, MatFormFieldModule],
})
export class ErrorsComponent implements OnInit {
  @Input({ required: true }) control: ErrorInputPossible = null;
  matcher = new MyErrorStateMatcher();
  errorsTable: { type: string; value: string }[] = [];
  ngOnInit(): void {
    this.control?.valueChanges.subscribe((_) => {
      const errors = this.control?.errors;
      errors && this.checkPossibleErrors(errors);
    });
  }

  private checkPossibleErrors(errors: object) {
    Object.keys(DefaultErrors).forEach((errorKey: string) =>
      this.defaultErrorChecker(errors, errorKey)
    );
  }

  defaultErrorChecker(errors: object, errorKey: string) {
    const errorOccur = errorKey && errorKey in errors;
    const errorNotOccur =  errorKey && !(errorKey in errors);
    if (errorOccur) {
      this.setErrorsToShow(errorKey);
      this.checkTableRedudanntErrorsForErrorKey(errorKey);
    } else if (errorNotOccur) {
      this.errorsTable = this.errorsTable.filter((e) => e.type !== errorKey);
    }
  }
  private setErrorsToShow(errorKey: string) {
    const errorValue = DefaultErrors[errorKey as ErrorsType];
    errorValue && this.errorsTable.push({ type: errorKey, value: errorValue });
  }

  private checkTableRedudanntErrorsForErrorKey(errorKey: string) {
    if (this.hasMoreThanOneRedudantValue(errorKey)) {
      this.errorsTable = Array.from(
        new Set(this.errorsTable.map((a) => JSON.stringify(a)))
      ).map((a) => JSON.parse(a));
    }
  }

  private hasMoreThanOneRedudantValue(errorKey: string): boolean {
    return (
      this.errorsTable.map((e) => e.type).filter((e) => e === errorKey).length >
      1
    );
  }
}
