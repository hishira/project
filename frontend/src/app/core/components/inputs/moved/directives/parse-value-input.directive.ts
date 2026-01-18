import { Directive } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { ViewContainerRef, Input } from '@angular/core';
@Directive({
  selector: '[crm-parse-value-input]',
  standalone: true,
})
export class ParseValueInptuDirective {
    @Input({required: true}) dataVariable: string | null = null;
    inputElement: HTMLInputElement;
    constructor(
    private ngControl: NgControl,
    private viewContainer: ViewContainerRef
  ) {
    if(!(this.viewContainer.element.nativeElement instanceof HTMLInputElement)){
        this.viewContainer.clear();
        throw Error('crm-parse-value-input can be applied only for input element')
    }
    this.inputElement = this.viewContainer.element.nativeElement;
    this.valueCheck(this.ngControl.valueAccessor)
  }

  valueCheck(control: ControlValueAccessor | null) : void {
    if(control === null) return;
    const orginalOnChangeFunction = control.registerOnChange;
    control.registerOnChange = (fn: (_: unknown)=>void)=>{
        return orginalOnChangeFunction.call(control, (value: string | Record<string, any>)=>{
          if(typeof value === 'object'){
                if(this.dataVariable && this.dataVariable in value){
                    this.inputElement.value = value[this.dataVariable];
                }
            }
            fn(value);
        })
    }
  }
}
