import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { MainPageViewComponent } from '../../../core/components/main-page-view/main-page-view.component';
import { PageHeaderComponent } from '../../../core/components/page-header/page-header.component';
import { OnboardingService } from '../onboarding.service';

@Component({
  selector: 'app-onboarding-list',
  standalone: true,
  imports: [
    CommonModule, RouterLink,
    MatCardModule, MatIconModule, MatButtonModule,
    MatChipsModule, MatProgressBarModule, MatTooltipModule,
    MainPageViewComponent,
    PageHeaderComponent,
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