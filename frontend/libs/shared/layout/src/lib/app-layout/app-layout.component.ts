import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SideNavComponentV2 } from '../side-nav/side-nav.component';
import { ToolbarComponent } from '../toolbar/toolbar.component';

@Component({
  selector: 'app-layout',
  templateUrl: './app-layout.component.html',
  styleUrl: './app-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterOutlet, 
    ToolbarComponent,
    MatSidenavModule,
    SideNavComponentV2
  ],
})
export class AppLayoutComponent {
  drawerOpened = false;

  toggleDrawer(): void {
    this.drawerOpened = !this.drawerOpened;
  }
}
