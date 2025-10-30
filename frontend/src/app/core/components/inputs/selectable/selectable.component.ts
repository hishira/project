import { ChangeDetectionStrategy, Component, effect, forwardRef, input } from '@angular/core';
import { FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MatFormField, MatSelectModule } from '@angular/material/select';
import { BaseInputComponent } from '../base-input/base-input.component';
@Component({
  selector: 'app-selectable',
  templateUrl: './selectable.component.html',
  standalone: true,
  imports: [MatFormField, MatSelectModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectableComponent),
      multi: true,
    },
  ],
})
export class SelectableComponent extends BaseInputComponent<FormControl> {
  readonly label = input.required<string>();
  readonly isDisabled = input<boolean>(false);
  readonly selectableOptions = input<{ label: string; value: unknown }[]>();
  override prepareControl(): void {
    this.control = new FormControl(null);
  }
  private _effect = effect(() => {
    if (this.isDisabled()) {
      this.control.disable();
    } else {
      this.control.enable();
    }
  });
}
