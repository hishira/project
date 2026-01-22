import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Component, Input, OnDestroy, OnInit, ChangeDetectionStrategy, input } from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormArray,
  FormControl,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {
  Observable,
  OperatorFunction,
  Subscription,
  combineLatest,
  from,
  map,
  noop,
  pipe,
  shareReplay,
  startWith,
} from 'rxjs';
import { ParseValueInptuDirective } from '../directives/parse-value-input.directive';
import {
  AutocomepleteDataView,
  ControlData,
  FetchingAutoCompleteSerivce,
  ViewDataAuto,
} from '../autocomplete/autocomplete.component';

@Component({
  selector: 'crm-multi-select-with-search',
  templateUrl: './multi-select-with-search.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  styleUrls: ['./multi-select-with-search.scss'],
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ParseValueInptuDirective,
    AsyncPipe,
    NgFor,
    NgIf,
    MatIconModule,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: MutliSelectWithSearchComponent,
      multi: true,
    },
  ],
})
export class MutliSelectWithSearchComponent
  implements ControlValueAccessor, OnInit, OnDestroy
{

  readonly fetchingService = input.required<FetchingAutoCompleteSerivce
    | undefined>()
  readonly label = input<string>('');

  inputFormControl: FormControl = new FormControl();
  formArray: FormArray = new FormArray<any>([]);
  options: Observable<ViewDataAuto[]> = from([]);
  onChange: (value: ControlData) => void = () => noop;
  onTouch: (value: ControlData) => void = () => noop;
  piper = pipe(
    map((d: AutocomepleteDataView[]) => d.map((a) => a.getViewDate())),
    shareReplay(1)
  );

  private readonly subscription: Subscription = new Subscription();

  get ControlArrays(): AbstractControl[] {
    return this.formArray.controls;
  }

  ngOnInit(): void {
    const fetchingStream$ =
      this.fetchingService()?.getData()?.pipe(this.piper) ?? from([]);
    const controlStream$ = this.inputFormControl.valueChanges.pipe(
      startWith('')
    );
    this.options = combineLatest([controlStream$, fetchingStream$]).pipe(
      this.mapCombinedDataFromInputAndService()
    );
    this.subscription.add(this.formArray.valueChanges.subscribe((valueArray) =>
      this.onChange(valueArray)
    ));
  }

  ngOnDestroy(): void {
      this.subscription.unsubscribe();
  }
  writeValue(obj: any): void {
    if (Array.isArray(obj)) {
      obj.forEach((value) => this.formArray.push(new FormControl(value)));
    }
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }
  setDisabledState?(isDisabled: boolean): void {}

  isDisabled(option: ViewDataAuto): boolean {
    return (
      this.ControlArrays.filter((control) =>
        option.controlData.equals(control.value)
      ).length > 0
    );
  }

  handle($event: MatAutocompleteSelectedEvent) {
    this.formArray.push(new FormControl($event.option.value));
  }

  remove(controlIndex: number) {
    this.formArray.removeAt(controlIndex);
  }

  private mapCombinedDataFromInputAndService(): OperatorFunction<
    [any, ViewDataAuto[]],
    ViewDataAuto[]
  > {
    return map(([controlValue, fetchedData]) => {
      if (this.isNotNillString(controlValue)) {
        return fetchedData.filter((data: any) =>
          data.viewData.toLowerCase().includes(controlValue.toLowerCase())
        );
      }
      return fetchedData;
    });
  }

  private isNotNillString(element: unknown): boolean {
    return typeof element === 'string' && element !== null && element !== '';
  }
}
