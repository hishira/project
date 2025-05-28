import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivityService } from '../../../core/services/activity.service';
import { ActivityType, DifficultyLevel, CreateActivityDto } from '../../../shared/models/activity.model';

@Component({
  selector: 'app-activity-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="activity-form-container">
      <!-- Header -->
      <mat-toolbar class="form-header">
        <button mat-icon-button (click)="goBack()">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <h1>{{ isEditMode() ? 'Edit Activity' : 'Add New Activity' }}</h1>
      </mat-toolbar>

      <!-- Loading State -->
      @if (isLoading()) {
        <div class="loading-container">
          <mat-spinner></mat-spinner>
          <p>{{ isEditMode() ? 'Loading activity...' : 'Saving activity...' }}</p>
        </div>
      }

      <!-- Form -->
      @if (!isLoading()) {
        <mat-card class="form-card">
          <mat-card-content>
            <form [formGroup]="activityForm" (ngSubmit)="onSubmit()" class="activity-form">
              <!-- Activity Name -->
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Activity Name</mat-label>
                <input matInput formControlName="title" placeholder="e.g., Morning Run">
                <mat-icon matSuffix>fitness_center</mat-icon>
                @if (activityForm.get('title')?.hasError('required') && activityForm.get('title')?.touched) {
                  <mat-error>Activity name is required</mat-error>
                }
              </mat-form-field>

              <!-- Activity Type -->
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Activity Type</mat-label>
                <mat-select formControlName="type">
                  @for (type of activityTypes; track type.value) {
                    <mat-option [value]="type.value">
                      <mat-icon>{{ activityService.getActivityIcon(type.value) }}</mat-icon>
                      {{ type.label }}
                    </mat-option>
                  }
                </mat-select>
                @if (activityForm.get('type')?.hasError('required') && activityForm.get('type')?.touched) {
                  <mat-error>Activity type is required</mat-error>
                }
              </mat-form-field>

              <!-- Date and Duration Row -->
              <div class="form-row">
                <mat-form-field appearance="outline">
                  <mat-label>Date</mat-label>
                  <input matInput [matDatepicker]="picker" formControlName="activityDate">
                  <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
                  <mat-datepicker #picker></mat-datepicker>
                  @if (activityForm.get('activityDate')?.hasError('required') && activityForm.get('activityDate')?.touched) {
                    <mat-error>Date is required</mat-error>
                  }
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Duration (minutes)</mat-label>
                  <input matInput type="number" formControlName="duration" min="1">
                  <mat-icon matSuffix>schedule</mat-icon>
                  @if (activityForm.get('duration')?.hasError('required') && activityForm.get('duration')?.touched) {
                    <mat-error>Duration is required</mat-error>
                  }
                  @if (activityForm.get('duration')?.hasError('min') && activityForm.get('duration')?.touched) {
                    <mat-error>Duration must be at least 1 minute</mat-error>
                  }
                </mat-form-field>
              </div>

              <!-- Difficulty Level -->
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Difficulty Level</mat-label>
                <mat-select formControlName="difficulty">
                  @for (level of activityLevels; track level.value) {
                    <mat-option [value]="level.value">{{ level.label }}</mat-option>
                  }
                </mat-select>
                @if (activityForm.get('difficulty')?.hasError('required') && activityForm.get('difficulty')?.touched) {
                  <mat-error>Difficulty level is required</mat-error>
                }
              </mat-form-field>

              <!-- Calories Burned (Optional) -->
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Calories Burned (Optional)</mat-label>
                <input matInput type="number" formControlName="caloriesBurned" min="1">
                <mat-icon matSuffix>local_fire_department</mat-icon>
                @if (activityForm.get('caloriesBurned')?.hasError('min') && activityForm.get('caloriesBurned')?.touched) {
                  <mat-error>Calories must be greater than 0</mat-error>
                }
              </mat-form-field>

              <!-- Description (Optional) -->
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Description (Optional)</mat-label>
                <textarea matInput formControlName="description" rows="3" 
                          placeholder="Add notes about your activity..."></textarea>
                <mat-icon matSuffix>description</mat-icon>
              </mat-form-field>

              <!-- Action Buttons -->
              <div class="form-actions">
                <button mat-button type="button" (click)="goBack()">
                  Cancel
                </button>
                <button mat-raised-button color="primary" type="submit" 
                        [disabled]="activityForm.invalid || isSaving()">
                  @if (isSaving()) {
                    <mat-spinner diameter="20"></mat-spinner>
                  }
                  {{ isEditMode() ? 'Update Activity' : 'Save Activity' }}
                </button>
              </div>
            </form>
          </mat-card-content>
        </mat-card>
      }
    </div>
  `,
  styleUrls: ['./activity-form.component.scss']
})
export class ActivityFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  public activityService = inject(ActivityService);
  private snackBar = inject(MatSnackBar);

  activityForm: FormGroup = this.fb.group({
    title: ['', Validators.required],
    type: ['', Validators.required],
    activityDate: [new Date(), Validators.required],
    duration: ['', [Validators.required, Validators.min(1)]],
    difficulty: ['', Validators.required],
    caloriesBurned: ['', Validators.min(1)],
    description: ['']
  });

  isEditMode = signal(false);
  isLoading = signal(false);
  isSaving = signal(false);
  activityId = signal<string | null>(null);

  activityTypes = Object.values(ActivityType).map(type => ({
    value: type,
    label: this.activityService.getActivityTypeLabel(type)
  }));

  activityLevels = Object.values(DifficultyLevel)
    .filter(value => typeof value === 'number')
    .map(level => ({
      value: level as number,
      label: this.activityService.getDifficultyLabel(level as number)
    }));

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.activityId.set(id);
      this.loadActivity(id);
    }
  }

  private loadActivity(id: string) {
    this.isLoading.set(true);
    this.activityService.getActivity(id).subscribe({
      next: (activity) => {
        this.activityForm.patchValue({
          title: activity.title,
          type: activity.type,
          activityDate: new Date(activity.activityDate),
          duration: activity.duration,
          difficulty: activity.difficulty,
          caloriesBurned: activity.caloriesBurned || '',
          description: activity.description || ''
        });
        this.isLoading.set(false);
      },
      error: (error) => {
        this.snackBar.open('Failed to load activity', 'Close', { duration: 3000 });
        this.isLoading.set(false);
        this.goBack();
      }
    });
  }

  onSubmit() {
    if (this.activityForm.invalid) {
      this.activityForm.markAllAsTouched();
      return;
    }

    this.isSaving.set(true);
    const formValue = this.activityForm.value;
    
    const activityData: CreateActivityDto = {
      title: formValue.title,
      type: formValue.type,
      activityDate: formValue.activityDate.toISOString(),
      duration: formValue.duration,
      difficulty: formValue.difficulty,
      caloriesBurned: formValue.caloriesBurned || undefined,
      description: formValue.description || undefined
    };

    const operation = this.isEditMode() 
      ? this.activityService.updateActivity(this.activityId()!, activityData)
      : this.activityService.createActivity(activityData);

    operation.subscribe({
      next: (activity) => {
        const message = this.isEditMode() ? 'Activity updated successfully' : 'Activity created successfully';
        this.snackBar.open(message, 'Close', { duration: 3000 });
        this.isSaving.set(false);
        this.router.navigate(['/activities', activity.id]);
      },
      error: (error) => {
        const message = this.isEditMode() ? 'Failed to update activity' : 'Failed to create activity';
        this.snackBar.open(message, 'Close', { duration: 3000 });
        this.isSaving.set(false);
      }
    });
  }

  goBack() {
    this.router.navigate(['/activities']);
  }
}
