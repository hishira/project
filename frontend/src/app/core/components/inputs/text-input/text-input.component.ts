import { ChangeDetectionStrategy, Component, forwardRef, Host, Injector, input, Optional } from '@angular/core';
import { FormControl, FormControlName, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
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
  ],
})
export class TextInputComponent extends BaseInputComponent<FormControl> {
  readonly label = input.required<string>();
  readonly placeholder = input<string>('');
  readonly inputType = input<'text' | 'password' | 'email'>('text');
  readonly icon = input<string>('');
  readonly errorsMap = input<ErrorsMap>({});
  errorsMessage: string[] = [];
  // eslint-disable-next-line @angular-eslint/prefer-inject
  constructor(@Optional() @Host() private injector: Injector) {
    super();
  }

  override prepareControl(): void {
    this.control = new FormControl(null);
  }
  ngAfterViewInit(): void {
    const control = this.injector.get(FormControlName, null);
    this.control.addValidators(control?.control?.validator ?? []);
    this.control.addAsyncValidators(control?.control?.asyncValidator ?? []);
  }
  protected override onInit(): void {
    const control = this.injector.get(FormControlName, null);
    console.log('valid', control);
    this.control.addValidators(control?.control?.validator ?? []);
    this.control.addAsyncValidators(control?.control?.asyncValidator ?? []);
    console.log(this.control);
    this.control.valueChanges.subscribe(() => {
      console.log(this.control);

      Object.keys(this.errorsMap() ?? {}).forEach((errorKey: string) => {
        if (this.control.hasError(errorKey)) {
          const customMessage: string = this.errorsMap()?.[errorKey] as string;
          customMessage && this.errorsMessage.push(customMessage);
        }
      });
    });
  }
}
