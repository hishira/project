import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { OnboardingService } from '../onboarding.service';

@Component({
  selector: 'app-onboarding-list',
  standalone: true,
  imports: [
    CommonModule, RouterLink,
    MatCardModule, MatIconModule, MatButtonModule,
    MatChipsModule, MatProgressBarModule, MatTooltipModule
  ],
  templateUrl: './onboarding-list.component.html',
  styleUrls: ['./onboarding-list.component.scss']
})
export class OnboardingListComponent {
  private onboardingService = inject(OnboardingService);
  list = this.onboardingService.getOnboardingList();

  getStatusClass(status: string): string {
    const map: Record<string, string> = {
      in_progress: 'status-in-progress',
      completed: 'status-completed',
      overdue: 'status-overdue'
    };
    return map[status] || '';
  }

  getStatusLabel(status: string): string {
    const map: Record<string, string> = {
      in_progress: 'W trakcie',
      completed: 'Zakończony',
      overdue: 'Opóźniony'
    };
    return map[status] || status;
  }
}