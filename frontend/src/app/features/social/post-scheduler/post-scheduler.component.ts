import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { SocialService } from '../social.service';
import { SocialPlatform } from '../social.model';
import { MatListModule } from '@angular/material/list';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-post-scheduler',
  standalone: true,
  imports: [
    CommonModule, RouterLink, ReactiveFormsModule,
    MatCardModule, MatIconModule, MatButtonModule,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatDatepickerModule, MatNativeDateModule, MatListModule, MatChipsModule,
  ],
  template: `
    <div class="scheduler-container">
      <div class="header">
        <a mat-icon-button routerLink="/social/mentions" class="back-btn">
          <mat-icon>arrow_back</mat-icon>
        </a>
        <h1>Zaplanuj nowy post</h1>
      </div>

      <mat-card>
        <mat-card-content>
          <form [formGroup]="postForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Platforma</mat-label>
              <mat-select formControlName="platform" required>
                @for (p of platforms; track p.value) {
                  <mat-option [value]="p.value">{{ p.label }}</mat-option>
                }
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Treść posta</mat-label>
              <textarea matInput formControlName="content" rows="4" required></textarea>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Data i godzina publikacji</mat-label>
              <input matInput [matDatepicker]="picker" formControlName="scheduledAt" required>
              <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
              <mat-datepicker #picker></mat-datepicker>
            </mat-form-field>

            <div class="form-actions">
              <button mat-stroked-button type="button" routerLink="/social/mentions">Anuluj</button>
              <button mat-raised-button color="primary" type="submit" [disabled]="postForm.invalid">Zaplanuj</button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>

      <mat-card class="scheduled-list">
        <mat-card-header>
          <mat-card-title>Zaplanowane posty</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <mat-list>
            @for (post of scheduledPosts(); track post.id) {
              <mat-list-item>
                <div class="post-item">
                  <div class="post-info">
                    <strong>{{ post.platform }}</strong> – {{ post.content | slice:0:60 }}...
                  </div>
                  <div class="post-meta">
                    <span>{{ post.scheduledAt | date:'dd MMM yyyy, HH:mm' }}</span>
                    <mat-chip [class]="post.status === 'published' ? 'status-published' : 'status-scheduled'">
                      {{ post.status }}
                    </mat-chip>
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
    .scheduler-container {
      padding: 24px;
      max-width: 700px;
      margin: 0 auto;
    }
    .header {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 24px;
    }
    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }
    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 16px;
      margin-top: 16px;
    }
    .scheduled-list {
      margin-top: 24px;
    }
    .post-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      flex-wrap: wrap;
      gap: 12px;
    }
    .post-meta {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .status-scheduled { background-color: #e0f2fe !important; color: #0369a1 !important; }
    .status-published { background-color: #d1fae5 !important; color: #065f46 !important; }
  `]
})
export class PostSchedulerComponent {
  private fb = inject(FormBuilder);
  private socialService = inject(SocialService);

  platforms: { value: SocialPlatform; label: string }[] = [
    { value: 'facebook', label: 'Facebook' },
    { value: 'twitter', label: 'Twitter' },
    { value: 'instagram', label: 'Instagram' },
    { value: 'linkedin', label: 'LinkedIn' }
  ];

  scheduledPosts = this.socialService.scheduledPosts;

  postForm = this.fb.group({
    platform: ['', Validators.required],
    content: ['', Validators.required],
    scheduledAt: [new Date(), Validators.required]
  });

  onSubmit() {
    if (this.postForm.valid) {
      const value = this.postForm.value;
      this.socialService.publishPost({
        platform: value.platform as SocialPlatform,
        content: value.content!,
        scheduledAt: value.scheduledAt!,
        status: 'scheduled',
        createdBy: 'Aktualny użytkownik' // w rzeczywistości z auth
      });
      this.postForm.reset({ scheduledAt: new Date() });
    }
  }
}