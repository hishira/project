import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { SocialProfile } from '../social.model';
import { SocialService } from '../social.service';
import { ProfileCardComponent } from './profile-card.component';

@Component({
  selector: 'app-profile-list',
  imports: [
    CommonModule,
    RouterLink,
    MatIconModule,
    MatButtonModule,
    ProfileCardComponent
  ],
  templateUrl: './profile-list.component.html',
  styleUrls: ['./profile-list.component.scss']
})
export class ProfileListComponent {
  private readonly socialService = inject(SocialService);

  readonly profiles = this.socialService.profiles;

  onToggleConnection(profile: SocialProfile): void {
    console.log('Toggle connection for profile:', profile.id);
    // TODO: Implement connection toggle logic
  }

  onSyncProfile(profile: SocialProfile): void {
    console.log('Sync profile:', profile.id);
    // TODO: Implement sync logic
  }

  onAddProfile(): void {
    console.log('Add new profile');
    // TODO: Implement add profile logic
  }
}
