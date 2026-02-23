import { Directive } from '@angular/core';
import {
    ControlValueAccessor,
    NgControl
} from '@angular/forms';

@Directive({
  selector: '[number-directive]',
  standalone: true,
})
export class NumberDirective {
  constructor(private ngControl: NgControl) {
    this.removeNotNumbersFromInput(this.ngControl.valueAccessor);
  }

  removeNotNumbersFromInput(control: ControlValueAccessor | null): void {
    if (control === null) return;
    const orginalOnChangeFunction = control.registerOnChange;

    control.registerOnChange = (fn: (_: unknown) => void) => {
      return orginalOnChangeFunction.call(control, (value: string) => {
        const ff = value.replaceAll(/\D/g, '');
        control.writeValue(ff);
        fn(ff);
      });
    };
  }
}
