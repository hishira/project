import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { SocialService } from '../social.service';
import { SocialProfile } from '../social.model';
import { ProfileCardComponent } from './profile-card.component';

@Component({
  selector: 'app-profile-list',
  standalone: true,
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
