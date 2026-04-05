import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { MatSidenavModule, MatDrawer } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatDivider } from '@angular/material/divider';
import { ToolbarComponent } from '../../../features/dashboard/toolbar/toolbar.component';

@Component({
  selector: 'app-layout',
  templateUrl: './app-layout.component.html',
  styleUrl: './app-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    RouterOutlet, 
    RouterLink,
    ToolbarComponent,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatDivider
  ],
})
export class AppLayoutComponent {
  drawerOpened = false;

  toggleDrawer(): void {
    this.drawerOpened = !this.drawerOpened;
  }
}
