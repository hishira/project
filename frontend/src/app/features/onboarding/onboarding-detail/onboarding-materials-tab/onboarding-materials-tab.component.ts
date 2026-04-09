import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TrainingMaterial } from '../../onboarding.model';
import { getMaterialTypeIcon } from '../../onboarding-status.utils';

@Component({
  selector: 'app-onboarding-materials-tab',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatListModule, MatButtonModule, MatIconModule, MatTooltipModule],
  template: `
    <div class="tab-content">
      <mat-card class="inner-card">
        <mat-card-header>
          <mat-card-title>Materiały szkoleniowe</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <mat-list>
            @for (material of materials(); track material.id) {
              <mat-list-item class="material-item">
                <div class="material-row">
                  <mat-icon class="material-icon">{{ getMaterialIcon(material.type) }}</mat-icon>
                  <div class="material-info">
                    <span class="material-title">{{ material.title }}</span>
                    @if (material.duration) {
                      <span class="material-duration">({{ material.duration }} min)</span>
                    }
                  </div>
                  <div class="material-status">
                    @if (material.viewedByClient) {
                      <span class="viewed">
                        <mat-icon>check_circle</mat-icon> Obejrzane {{ material.viewedAt | date: 'dd MMM' }}
                      </span>
                    } @else {
                      <button mat-stroked-button (click)="onMarkViewed(material)">
                        <mat-icon>visibility</mat-icon> Oznacz jako obejrzane
                      </button>
                    }
                  </div>
                  <a mat-icon-button [href]="material.url" target="_blank" matTooltip="Otwórz">
                    <mat-icon>open_in_new</mat-icon>
                  </a>
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
    .material-item { height: auto !important; padding: 12px 0; }
    .material-row {
      display: flex;
      align-items: center;
      width: 100%;
      gap: 16px;
      .material-icon { color: #1976d2; }
      .material-info {
        flex: 1;
        display: flex;
        align-items: center;
        gap: 8px;
        .material-title { font-weight: 500; }
        .material-duration { font-size: 0.8rem; color: #64748b; }
      }
      .material-status .viewed {
        display: flex;
        align-items: center;
        gap: 4px;
        color: #2e7d32;
      }
    }
  `]
})
export class OnboardingMaterialsTabComponent {
  materials = input.required<TrainingMaterial[]>();
  markViewed = output<TrainingMaterial>();

  getMaterialIcon = getMaterialTypeIcon;

  onMarkViewed(material: TrainingMaterial) {
    this.markViewed.emit(material);
  }
}
