import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterOutlet } from '@angular/router';
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
  readonly drawerOpened = signal(false);

  close(): void {
    this.drawerOpened.set(false);
  }

  toggleDrawer(): void {
    this.drawerOpened.update(v => !v);
  }
}
