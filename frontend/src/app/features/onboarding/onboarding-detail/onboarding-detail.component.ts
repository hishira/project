import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { OnboardingService } from '../onboarding.service';
import { ClientOnboarding, TrainingMaterial, OnboardingTask, Webinar } from '../onboarding.model';
import { MainPageViewComponent } from '../../../core/components/main-page-view/main-page-view.component';
import { PageHeaderComponent } from '../../../core/components/page-header/page-header.component';

@Component({
  selector: 'app-onboarding-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatDividerModule,
    MatTabsModule,
    MatCheckboxModule,
    MatListModule,
    MatProgressBarModule,
    MatTooltipModule,
    MainPageViewComponent,
    PageHeaderComponent,
  ],
  templateUrl: './onboarding-detail.component.html',
  styleUrls: ['./onboarding-detail.component.scss']
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

  getMaterialIcon(type: string): string {
    const map: Record<string, string> = {
      article: 'article',
      video: 'play_circle',
      presentation: 'slideshow',
      link: 'link'
    };
    return map[type] || 'description';
  }

  // Symulowane akcje
  toggleTask(task: OnboardingTask) {
    this.onboardingService.markTaskAsCompleted(this.onboarding()!.id, task.id);
  }

  markMaterialViewed(material: TrainingMaterial) {
    this.onboardingService.markMaterialAsViewed(this.onboarding()!.id, material.id);
  }

  registerForWebinar(webinar: Webinar) {
    this.onboardingService.registerForWebinar(this.onboarding()!.id, webinar.id);
  }

  sendReminder() {
    this.onboardingService.sendReminder(this.onboarding()!.id);
  }
}