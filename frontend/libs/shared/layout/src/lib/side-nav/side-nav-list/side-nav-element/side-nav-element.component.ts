import { Component } from "@angular/core";
import { MatIcon } from "@angular/material/icon";


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
    imports: [MatIcon]
})
export class  SideNavElementComponent{
  close(): void {
    
  }
}