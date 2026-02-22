import { AfterViewInit, Directive, ElementRef, inject, OnInit } from '@angular/core';

@Directive({
    selector: 'mat-label',
    standalone: true,
})
export class LabelFloatDirective implements AfterViewInit {
  private el = inject(ElementRef);
  ngAfterViewInit(): void{
    const element = this.el.nativeElement as HTMLElement;
    const parent = element?.parentElement;
    if(element.offsetWidth > (parent?.offsetWidth ?? 0)) {
        element.classList.add('text-class')
    }
  }
}
