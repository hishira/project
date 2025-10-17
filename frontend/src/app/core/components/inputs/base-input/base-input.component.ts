import { Directive, forwardRef } from "@angular/core";
import { AbstractControl, ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

@Directive({
    standalone: true,
    providers:[{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => BaseInputComponent),
        multi: true 
    }],
})
export abstract class BaseInputComponent<T extends AbstractControl> implements ControlValueAccessor{
    protected control!: T;
    
    abstract prepareControl():void;

    constructor(){
        this.prepareControl();
    }
    writeValue(obj: any): void {
        throw new Error("Method not implemented.");
    }
    registerOnChange(fn: any): void {
        throw new Error("Method not implemented.");
    }
    registerOnTouched(fn: any): void {
        throw new Error("Method not implemented.");
    }
    setDisabledState?(isDisabled: boolean): void {
        throw new Error("Method not implemented.");
    }
}