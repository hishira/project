import { Component, inject, InjectionToken, output } from "@angular/core";
import { MatIcon } from "@angular/material/icon";
import { RouterLink } from "@angular/router";

export interface SideNavElement {
  title: string;
  link: string;
  closeHandle?: Function
  icon?: string;
  isLastInSection?: boolean;
  customClickHandle?: () => void
}

export const SIDE_NAV_ELEMENTS = new InjectionToken<SideNavElement[]>('SIDE_NAV_ELEMENTS')

@Component({
  selector: 'app-side-nav-element',
  templateUrl: './side-nav-element.component.html',
  styleUrl: './side-nav-element.component.scss',
  imports: [MatIcon, RouterLink]
})
export class SideNavElementComponent {
  readonly sideNavElement = inject(SIDE_NAV_ELEMENTS);
  readonly closeEmit = output<void>()
  
  close(element: SideNavElement): void {
    this.closeEmit.emit();
    element?.customClickHandle?.();
  }
}