import { Component } from "@angular/core";


export interface SineNavElement {
  title: string;
  link: string;
  closeHandle?: Function
  icon?: string;
}


@Component({
    selector: 'app-side-nav-element',
    templateUrl: './side-nav-element.component.html',
    styleUrl: './side-nav-element.component.scss',
    imports: []
})
export class  SideNavElementComponent{}