import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SocialPlatform } from '../../../features/social/social.model';
import { PLATFORM_ICONS } from '../social-icons/social-icons.constants';

@Component({
  selector: 'app-platform-icon',
  standalone: true,
  imports: [MatIconModule, MatTooltipModule],
  template: `
    <mat-icon [matTooltip]="platform()">{{ getIcon() }}</mat-icon>
  `,
  styles: [`
    :host {
      display: inline-flex;
    }
  `]
})
export class PlatformIconComponent {
  readonly platform = input.required<SocialPlatform>();

  getIcon(): string {
    return PLATFORM_ICONS[this.platform()] ?? 'public';
  }
}
