import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { SocialProfile } from '../social.model';
import { PLATFORM_INFO } from './profile-list.constants';

@Component({
  selector: 'app-profile-card',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatSlideToggleModule
  ],
  templateUrl: './profile-card.component.html',
  styleUrls: ['./profile-card.component.scss']
})
export class ProfileCardComponent {
  readonly profile = input.required<SocialProfile>();
  readonly toggleConnection = output<SocialProfile>();
  readonly syncProfile = output<SocialProfile>();

  protected readonly PLATFORM_INFO = PLATFORM_INFO;

  onToggleConnection(): void {
    this.toggleConnection.emit(this.profile());
  }

  onSync(): void {
    this.syncProfile.emit(this.profile());
  }

  protected getPlatformInfo() {
    return PLATFORM_INFO[this.profile().platform];
  }
}
