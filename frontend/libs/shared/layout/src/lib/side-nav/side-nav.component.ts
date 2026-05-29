import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { SideNavListComponent } from "./side-nav-list/side-nav-list.component";

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
