import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { SocialService } from '../social.service';

@Component({
  selector: 'app-profile-list',
  standalone: true,
  imports: [CommonModule, RouterLink, MatCardModule, MatIconModule, MatButtonModule, MatSlideToggleModule],
  template: `
    <div class="profiles-container">
      <div class="header">
        <a mat-icon-button routerLink="/social/mentions" class="back-btn">
          <mat-icon>arrow_back</mat-icon>
        </a>
        <h1>Profile społecznościowe</h1>
        <button mat-raised-button color="primary">Dodaj profil</button>
      </div>

      <div class="profiles-grid">
        @for (profile of profiles(); track profile.id) {
          <mat-card class="profile-card">
            <mat-card-header>
              <mat-icon class="platform-icon">{{ getPlatformIcon(profile.platform) }}</mat-icon>
              <mat-card-title>{{ profile.profileName }}</mat-card-title>
              <mat-card-subtitle>{{ profile.platform }}</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <p><a [href]="profile.profileUrl" target="_blank">{{ profile.profileUrl }}</a></p>
              @if (profile.lastSync) {
                <p class="sync">Ostatnia synchronizacja: {{ profile.lastSync | date:'dd MMM yyyy, HH:mm' }}</p>
              }
            </mat-card-content>
            <mat-card-actions>
              <mat-slide-toggle [checked]="profile.connected" (change)="toggleConnection(profile)">
                {{ profile.connected ? 'Połączony' : 'Rozłączony' }}
              </mat-slide-toggle>
              <button mat-icon-button (click)="sync(profile)"><mat-icon>sync</mat-icon></button>
            </mat-card-actions>
          </mat-card>
        }
      </div>
    </div>
  `,
  styles: [`
    .profiles-container {
      padding: 24px;
      max-width: 1000px;
      margin: 0 auto;
    }
    .header {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 24px;
    }
    .profiles-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
    }
    .profile-card {
      .platform-icon {
        font-size: 32px;
        width: 32px;
        height: 32px;
        margin-right: 12px;
      }
      .sync {
        font-size: 0.8rem;
        color: #64748b;
      }
      .mat-mdc-card-actions {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
    }
  `]
})
export class ProfileListComponent {
  private socialService = inject(SocialService);
  profiles = this.socialService.profiles;

  getPlatformIcon(platform: string): string {
    const icons: Record<string, string> = {
      facebook: 'facebook',
      twitter: 'twitter',
      instagram: 'instagram',
      linkedin: 'linkedin',
      youtube: 'youtube',
      other: 'public'
    };
    return icons[platform] || 'public';
  }

  toggleConnection(profile: any) {
    console.log('Przełącz połączenie dla:', profile.id);
  }

  sync(profile: any) {
    console.log('Synchronizuj profil:', profile.id);
  }
}