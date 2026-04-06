import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SideNavComponent } from '../side-nav/side-nav.component';
import { ToolbarComponent } from '../../../features/dashboard/toolbar/toolbar.component';

@Component({
  selector: 'app-layout',
  templateUrl: './app-layout.component.html',
  styleUrl: './app-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    RouterOutlet, 
    ToolbarComponent,
    MatSidenavModule,
    SideNavComponent
  ],
})
export class AppLayoutComponent {
  drawerOpened = false;

  toggleDrawer(): void {
    this.drawerOpened = !this.drawerOpened;
  }
}
