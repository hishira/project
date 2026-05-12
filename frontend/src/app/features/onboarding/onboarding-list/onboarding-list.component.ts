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
import { getOnboardingStatusClass, getOnboardingStatusLabel } from '../onboarding-status.utils';

@Component({
  selector: 'app-onboarding-list',
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

  getStatusClass = getOnboardingStatusClass;
  getStatusLabel = getOnboardingStatusLabel;
}