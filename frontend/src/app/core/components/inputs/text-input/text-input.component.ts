import { ChangeDetectionStrategy, Component, forwardRef, inject, Injector, input } from '@angular/core';
import { FormControl, NG_VALIDATORS, NG_VALUE_ACCESSOR, NgControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BaseInputComponent } from '../base-input/base-input.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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
  readonly errorsMap = input<ErrorsMap>();
  errorsMessage: string[] = [];
  override prepareControl(): void {
    console.log(this.rawControl);
    this.control = (this.rawControl?.control as FormControl) ?? new FormControl(null);
  }

  protected override onInit(): void {
    this.control.valueChanges.subscribe(() => {
      Object.keys(this.errorsMap() ?? {}).forEach((errorKey) => {
        if (this.control.hasError(errorKey)) {
          this.errorsMap()?.[errorKey] && this.errorsMessage.push(this.errorsMap()?.[errorKey] as unknown as string);
        }
      });
    });
  }
}
