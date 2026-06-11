import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { SideNavListComponent } from "./side-nav-list/side-nav-list.component";

@Component({
  selector: 'app-side-nav-v2',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatIcon,
    SideNavListComponent
  ],
})
export class SideNavComponentV2 {
  readonly closed = output();
}
