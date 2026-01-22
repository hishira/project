import { NgFor } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MyErrorStateMatcher } from './errors-state-matcher';

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

//TODO: Check if we can implement errors inserting like ng-content
@Component({
  selector: 'crm-errors',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './errors.component.html',
  standalone: true,
  imports: [ MatInputModule, MatFormFieldModule],
})
export class ErrorsComponent implements OnInit {
  readonly control = input.required<ErrorInputPossible>();
  readonly matcher = new MyErrorStateMatcher();
  errorsTable: { type: string; value: string }[] = [];

  ngOnInit(): void {
    this.control()?.valueChanges.subscribe((_) => {
      const errors = this.control()?.errors;
      errors && this.checkPossibleErrors(errors);
    });
  }

  defaultErrorChecker(errors: object, errorKey: string): void {
    const errorOccur = errorKey && errorKey in errors;
    const errorNotOccur = errorKey && !(errorKey in errors);
    if (errorOccur) {
      this.setErrorsToShow(errorKey);
      this.checkTableRedudanntErrorsForErrorKey(errorKey);
    } else if (errorNotOccur) {
      this.errorsTable = this.errorsTable.filter((e) => e.type !== errorKey);
    }
  }
  private setErrorsToShow(errorKey: string): void {
    const errorValue = DefaultErrors[errorKey as ErrorsType];
    errorValue && this.errorsTable.push({ type: errorKey, value: errorValue });
  }

  private checkTableRedudanntErrorsForErrorKey(errorKey: string): void {
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

   private checkPossibleErrors(errors: object): void {
    Object.keys(DefaultErrors).forEach((errorKey: string) =>
      this.defaultErrorChecker(errors, errorKey)
    );
  }
}
