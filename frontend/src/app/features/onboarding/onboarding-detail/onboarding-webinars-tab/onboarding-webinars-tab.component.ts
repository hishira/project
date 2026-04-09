import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Webinar } from '../../onboarding.model';

@Component({
  selector: 'app-onboarding-webinars-tab',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatListModule, MatButtonModule, MatIconModule],
  template: `
    <div class="tab-content">
      <mat-card class="inner-card">
        <mat-card-header>
          <mat-card-title>Zaplanowane webinary</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <mat-list>
            @for (webinar of webinars(); track webinar.id) {
              <mat-list-item class="webinar-item">
                <div class="webinar-row">
                  <div class="webinar-info">
                    <span class="webinar-title">{{ webinar.title }}</span>
                    <span class="webinar-meta">
                      {{ webinar.scheduledAt | date: 'dd MMM yyyy, HH:mm' }} ({{ webinar.duration }} min)
                    </span>
                    <span class="webinar-host">Prowadzący: {{ webinar.host }}</span>
                  </div>
                  <div class="webinar-status">
                    @if (webinar.registered) {
                      @if (webinar.attended) {
                        <span class="attended"><mat-icon>check_circle</mat-icon> Uczestniczył</span>
                      } @else {
                        <span class="registered"><mat-icon>event</mat-icon> Zarejestrowany</span>
                      }
                    } @else {
                      <button mat-stroked-button (click)="onRegister(webinar)">
                        <mat-icon>event_available</mat-icon> Zarejestruj
                      </button>
                    }
                  </div>
                </div>
              </mat-list-item>
            }
          </mat-list>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .tab-content { padding: 24px 0; }
    .inner-card .mat-mdc-card-header { padding: 16px 16px 0; }
    .webinar-item { height: auto !important; padding: 12px 0; }
    .webinar-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      flex-wrap: wrap;
      gap: 16px;
      .webinar-info {
        display: flex;
        flex-direction: column;
        .webinar-title { font-weight: 500; color: #0f172a; }
        .webinar-meta, .webinar-host { font-size: 0.8rem; color: #64748b; }
      }
      .webinar-status {
        .registered, .attended {
          display: flex;
          align-items: center;
          gap: 4px;
          color: #1976d2;
        }
        .attended { color: #2e7d32; }
      }
    }
  `]
})
export class OnboardingWebinarsTabComponent {
  webinars = input.required<Webinar[]>();
  register = output<Webinar>();

  onRegister(webinar: Webinar) {
    this.register.emit(webinar);
  }
}
