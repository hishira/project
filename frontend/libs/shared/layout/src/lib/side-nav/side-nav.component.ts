import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { SideNavListComponent } from "./side-nav-list/side-nav-list.component";

export interface SineNavElement {
  title: string;
  link: string;
  closeHandle?: Function
  icon?: string;
}
@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatIcon,
    SideNavListComponent
  ],
})
export class SideNavComponent {

}
