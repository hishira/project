import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ChangeDetectionStrategy } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { OnboardingService } from '../onboarding.service';
import { ClientOnboarding } from '../onboarding.model';
import { MainPageViewComponent } from '../../../core/components/main-page-view/main-page-view.component';
import { PageHeaderComponent } from '../../../core/components/page-header/page-header.component';
import { OnboardingSummaryComponent } from './onboarding-summary/onboarding-summary.component';
import { OnboardingTasksTabComponent } from './onboarding-tasks-tab/onboarding-tasks-tab.component';
import { OnboardingMaterialsTabComponent } from './onboarding-materials-tab/onboarding-materials-tab.component';
import { OnboardingWebinarsTabComponent } from './onboarding-webinars-tab/onboarding-webinars-tab.component';

@Component({
  selector: 'app-onboarding-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatIconModule,
    MatButtonModule,
    MatTabsModule,
    MainPageViewComponent,
    PageHeaderComponent,
    OnboardingSummaryComponent,
    OnboardingTasksTabComponent,
    OnboardingMaterialsTabComponent,
    OnboardingWebinarsTabComponent
  ],
  templateUrl: './onboarding-detail.component.html',
  styleUrls: ['./onboarding-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OnboardingDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private onboardingService = inject(OnboardingService);
  onboarding = signal<ClientOnboarding | undefined>(undefined);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const found = this.onboardingService.getOnboardingById(id);
      this.onboarding.set(found);
    }
  }

  toggleTask(task: any) {
    const current = this.onboarding();
    if (current) {
      this.onboardingService.markTaskAsCompleted(current.id, task.id);
    }
  }

  markMaterialViewed(material: any) {
    const current = this.onboarding();
    if (current) {
      this.onboardingService.markMaterialAsViewed(current.id, material.id);
    }
  }

  registerForWebinar(webinar: any) {
    const current = this.onboarding();
    if (current) {
      this.onboardingService.registerForWebinar(current.id, webinar.id);
    }
  }

  sendReminder() {
    const current = this.onboarding();
    if (current) {
      this.onboardingService.sendReminder(current.id);
    }
  }
}