import { AsyncPipe, NgFor } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  Observable,
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

export type ControlType = Record<string, unknown> | number | string | null;

export type ControlData = ControlType & {
  equals: (value: ControlData) => boolean;
};
export interface ViewDataAuto {
  viewData: string;
  controlData: ControlData;
}
export interface AutocomepleteDataView {
  getViewDate: () => ViewDataAuto;
}

export interface FetchingAutoCompleteSerivce {
  getData(): Observable<AutocomepleteDataView[]>;
}

@Component({
  selector: 'crm-autocomplete',
  templateUrl: './autocomplete.component.html',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: AutocompleteComponent,
      multi: true,
    },
  ],
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    NgFor,
    AsyncPipe,
    ParseValueInptuDirective,
    FormsModule,
  ],
})
export class AutocompleteComponent implements ControlValueAccessor, OnInit {
  @Input({ required: true }) fetchingService:
    | FetchingAutoCompleteSerivce
    | undefined = {
    getData: () => from([]),
  };
  @Input() label = '';

  //TODO: Fix problem with valuechange => onChange not emit value and not work like in crm-address or selectable
  @Output() valueChange: EventEmitter<ControlData> = new EventEmitter();

  options: Observable<ViewDataAuto[]> = from([]);
  formControl: FormControl<any | null> = new FormControl<string | null>(null);
  piper = pipe(
    map((d: AutocomepleteDataView[]) => d.map((a) => a.getViewDate())),
    shareReplay(1)
  );
  subscription: Subscription = new Subscription();
  onChange: (value: ControlData) => void = () => noop;
  onTouch: (value: ControlData) => void = () => noop;

  ngOnInit() {
    const fetchingStream$ =
      this.fetchingService?.getData()?.pipe(this.piper) ?? from([]);
    const controlStream$ = this.formControl.valueChanges.pipe(startWith(''));
    this.options = combineLatest([controlStream$, fetchingStream$]).pipe(
      map(([controlValue, fetchedData]) => {
        if (typeof controlValue !== 'string') {
          this.onChange(controlValue);
        } else if (controlValue !== null && controlValue !== '') {
          return fetchedData.filter((data) =>
            data.viewData.toLowerCase().includes(controlValue.toLowerCase())
          );
        }
        return fetchedData;
      })
    );
  }
  writeValue(obj: any): void {
    this.formControl.patchValue(obj?.value ?? obj);
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouch = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    //throw new Error('Method not implemented.');
  }
}
