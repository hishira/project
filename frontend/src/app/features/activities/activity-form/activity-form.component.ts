import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
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
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { ActivityService } from '../../../core/services/activity.service';
import { 
  ActivityType, 
  DifficultyLevel, 
  CreateActivityDto,
  ActivityMetadata
} from '../../../shared/models/activity.model';

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
    MatProgressSpinnerModule,
    MatChipsModule,
    MatExpansionModule
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
                          placeholder="Describe your activity..."></textarea>
                <mat-icon matSuffix>description</mat-icon>
              </mat-form-field>

              <!-- Notes (Optional) -->
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Notes (Optional)</mat-label>
                <textarea matInput formControlName="notes" rows="3" 
                          placeholder="Add any additional notes or observations..."></textarea>
                <mat-icon matSuffix>note</mat-icon>
              </mat-form-field>

              <!-- Activity-Specific Metadata -->
              @if (currentActivityType()) {
                <mat-expansion-panel class="metadata-panel">
                  <mat-expansion-panel-header>
                    <mat-panel-title>
                      <mat-icon>info</mat-icon>
                      Activity Details
                    </mat-panel-title>
                    <mat-panel-description>
                      Add specific details for {{ activityService.getActivityTypeLabel(currentActivityType()!) }}
                    </mat-panel-description>
                  </mat-expansion-panel-header>

                  <div formGroupName="metadata" class="metadata-content">
                    <!-- Swimming Metadata -->
                    @if (currentActivityType() === 'swimming') {
                      <div class="form-row">
                        <mat-form-field appearance="outline">
                          <mat-label>Pool Size (meters)</mat-label>
                          <input matInput type="number" formControlName="poolSize" min="1">
                          <mat-icon matSuffix>pool</mat-icon>
                          @if (activityForm.get('metadata.poolSize')?.hasError('required') && activityForm.get('metadata.poolSize')?.touched) {
                            <mat-error>Pool size is required</mat-error>
                          }
                        </mat-form-field>

                        <mat-form-field appearance="outline">
                          <mat-label>Number of Laps</mat-label>
                          <input matInput type="number" formControlName="laps" min="1">
                          <mat-icon matSuffix>repeat</mat-icon>
                          @if (activityForm.get('metadata.laps')?.hasError('required') && activityForm.get('metadata.laps')?.touched) {
                            <mat-error>Number of laps is required</mat-error>
                          }
                        </mat-form-field>
                      </div>

                      <mat-form-field appearance="outline" class="full-width">
                        <mat-label>Stroke Type (Optional)</mat-label>
                        <mat-select formControlName="strokeType">
                          <mat-option value="freestyle">Freestyle</mat-option>
                          <mat-option value="backstroke">Backstroke</mat-option>
                          <mat-option value="breaststroke">Breaststroke</mat-option>
                          <mat-option value="butterfly">Butterfly</mat-option>
                        </mat-select>
                      </mat-form-field>
                    }

                    <!-- Running Metadata -->
                    @if (currentActivityType() === 'running') {
                      <mat-form-field appearance="outline" class="full-width">
                        <mat-label>Location</mat-label>
                        <mat-select formControlName="location">
                          <mat-option value="treadmill">Treadmill</mat-option>
                          <mat-option value="outdoor">Outdoor</mat-option>
                          <mat-option value="track">Track</mat-option>
                        </mat-select>
                        @if (activityForm.get('metadata.location')?.hasError('required') && activityForm.get('metadata.location')?.touched) {
                          <mat-error>Location is required</mat-error>
                        }
                      </mat-form-field>

                      <div class="form-row">
                        <mat-form-field appearance="outline">
                          <mat-label>Distance (km)</mat-label>
                          <input matInput type="number" formControlName="distance" min="0.1" step="0.1">
                          <mat-icon matSuffix>straighten</mat-icon>
                        </mat-form-field>

                        <mat-form-field appearance="outline">
                          <mat-label>Pace (min/km)</mat-label>
                          <input matInput type="number" formControlName="pace" min="1" step="0.1">
                          <mat-icon matSuffix>speed</mat-icon>
                        </mat-form-field>
                      </div>

                      <mat-form-field appearance="outline" class="full-width">
                        <mat-label>Elevation Gain (meters)</mat-label>
                        <input matInput type="number" formControlName="elevation" min="0">
                        <mat-icon matSuffix>terrain</mat-icon>
                      </mat-form-field>
                    }

                    <!-- Cycling Metadata -->
                    @if (currentActivityType() === 'cycling') {
                      <mat-form-field appearance="outline" class="full-width">
                        <mat-label>Location</mat-label>
                        <mat-select formControlName="location">
                          <mat-option value="indoor">Indoor</mat-option>
                          <mat-option value="outdoor">Outdoor</mat-option>
                          <mat-option value="mountain">Mountain</mat-option>
                          <mat-option value="road">Road</mat-option>
                        </mat-select>
                        @if (activityForm.get('metadata.location')?.hasError('required') && activityForm.get('metadata.location')?.touched) {
                          <mat-error>Location is required</mat-error>
                        }
                      </mat-form-field>

                      <div class="form-row">
                        <mat-form-field appearance="outline">
                          <mat-label>Distance (km)</mat-label>
                          <input matInput type="number" formControlName="distance" min="0.1" step="0.1">
                          <mat-icon matSuffix>straighten</mat-icon>
                        </mat-form-field>

                        <mat-form-field appearance="outline">
                          <mat-label>Avg Speed (km/h)</mat-label>
                          <input matInput type="number" formControlName="avgSpeed" min="1" step="0.1">
                          <mat-icon matSuffix>speed</mat-icon>
                        </mat-form-field>
                      </div>

                      <mat-form-field appearance="outline" class="full-width">
                        <mat-label>Elevation Gain (meters)</mat-label>
                        <input matInput type="number" formControlName="elevation" min="0">
                        <mat-icon matSuffix>terrain</mat-icon>
                      </mat-form-field>
                    }

                    <!-- Skating Metadata -->
                    @if (currentActivityType() === 'skating') {
                      <div class="form-row">
                        <mat-form-field appearance="outline">
                          <mat-label>Skating Type</mat-label>
                          <mat-select formControlName="type">
                            <mat-option value="ice">Ice Skating</mat-option>
                            <mat-option value="roller">Roller Skating</mat-option>
                            <mat-option value="inline">Inline Skating</mat-option>
                          </mat-select>
                          @if (activityForm.get('metadata.type')?.hasError('required') && activityForm.get('metadata.type')?.touched) {
                            <mat-error>Skating type is required</mat-error>
                          }
                        </mat-form-field>

                        <mat-form-field appearance="outline">
                          <mat-label>Location</mat-label>
                          <mat-select formControlName="location">
                            <mat-option value="indoor">Indoor</mat-option>
                            <mat-option value="outdoor">Outdoor</mat-option>
                          </mat-select>
                          @if (activityForm.get('metadata.location')?.hasError('required') && activityForm.get('metadata.location')?.touched) {
                            <mat-error>Location is required</mat-error>
                          }
                        </mat-form-field>
                      </div>

                      <mat-form-field appearance="outline" class="full-width">
                        <mat-label>Distance (km)</mat-label>
                        <input matInput type="number" formControlName="distance" min="0.1" step="0.1">
                        <mat-icon matSuffix>straighten</mat-icon>
                      </mat-form-field>
                    }

                    <!-- Horse Riding Metadata -->
                    @if (currentActivityType() === 'horse_riding') {
                      <div class="form-row">
                        <mat-form-field appearance="outline">
                          <mat-label>Discipline</mat-label>
                          <mat-select formControlName="discipline">
                            <mat-option value="dressage">Dressage</mat-option>
                            <mat-option value="jumping">Jumping</mat-option>
                            <mat-option value="trail">Trail</mat-option>
                            <mat-option value="racing">Racing</mat-option>
                            <mat-option value="western">Western</mat-option>
                            <mat-option value="other">Other</mat-option>
                          </mat-select>
                          @if (activityForm.get('metadata.discipline')?.hasError('required') && activityForm.get('metadata.discipline')?.touched) {
                            <mat-error>Discipline is required</mat-error>
                          }
                        </mat-form-field>

                        <mat-form-field appearance="outline">
                          <mat-label>Location</mat-label>
                          <mat-select formControlName="location">
                            <mat-option value="indoor">Indoor</mat-option>
                            <mat-option value="outdoor">Outdoor</mat-option>
                          </mat-select>
                          @if (activityForm.get('metadata.location')?.hasError('required') && activityForm.get('metadata.location')?.touched) {
                            <mat-error>Location is required</mat-error>
                          }
                        </mat-form-field>
                      </div>

                      <mat-form-field appearance="outline" class="full-width">
                        <mat-label>Horse Name (Optional)</mat-label>
                        <input matInput formControlName="horseName">
                        <mat-icon matSuffix>pets</mat-icon>
                      </mat-form-field>
                    }

                    <!-- Gym Workout Metadata -->
                    @if (currentActivityType() === 'gym_workout') {
                      <mat-form-field appearance="outline" class="full-width">
                        <mat-label>Workout Type</mat-label>
                        <mat-select formControlName="workoutType">
                          <mat-option value="strength">Strength Training</mat-option>
                          <mat-option value="cardio">Cardio</mat-option>
                          <mat-option value="mixed">Mixed</mat-option>
                        </mat-select>
                        @if (activityForm.get('metadata.workoutType')?.hasError('required') && activityForm.get('metadata.workoutType')?.touched) {
                          <mat-error>Workout type is required</mat-error>
                        }
                      </mat-form-field>

                      <!-- Exercises -->
                      <div class="array-field">
                        <div class="array-header">
                          <h4>Exercises</h4>
                          <button mat-icon-button type="button" (click)="addExercise()" color="primary">
                            <mat-icon>add</mat-icon>
                          </button>
                        </div>
                        <div formArrayName="exercises">
                          @for (exercise of exercisesArray.controls; track $index) {
                            <div class="array-item">
                              <mat-form-field appearance="outline" class="flex-grow">
                                <mat-label>Exercise {{ $index + 1 }}</mat-label>
                                <input matInput [formControlName]="$index" placeholder="e.g., Bench Press">
                              </mat-form-field>
                              <button mat-icon-button type="button" (click)="removeExercise($index)" color="warn">
                                <mat-icon>remove</mat-icon>
                              </button>
                            </div>
                          }
                        </div>
                      </div>

                      <!-- Equipment -->
                      <div class="array-field">
                        <div class="array-header">
                          <h4>Equipment</h4>
                          <button mat-icon-button type="button" (click)="addEquipment()" color="primary">
                            <mat-icon>add</mat-icon>
                          </button>
                        </div>
                        <div formArrayName="equipment">
                          @for (equipment of equipmentArray.controls; track $index) {
                            <div class="array-item">
                              <mat-form-field appearance="outline" class="flex-grow">
                                <mat-label>Equipment {{ $index + 1 }}</mat-label>
                                <input matInput [formControlName]="$index" placeholder="e.g., Dumbbells">
                              </mat-form-field>
                              <button mat-icon-button type="button" (click)="removeEquipment($index)" color="warn">
                                <mat-icon>remove</mat-icon>
                              </button>
                            </div>
                          }
                        </div>
                      </div>
                    }
                  </div>
                </mat-expansion-panel>
              }

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
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  public activityService = inject(ActivityService);
  private readonly snackBar = inject(MatSnackBar);

  activityForm: FormGroup = this.fb.group({
    title: ['', Validators.required],
    type: ['', Validators.required],
    activityDate: [new Date(), Validators.required],
    duration: ['', [Validators.required, Validators.min(1)]],
    difficulty: ['', Validators.required],
    caloriesBurned: ['', Validators.min(1)],
    description: [''],
    notes: [''],
    metadata: this.fb.group({})
  });

  currentActivityType = signal<ActivityType | null>(null);

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
    // Subscribe to activity type changes to update metadata form
    this.activityForm.get('type')?.valueChanges.subscribe((type: ActivityType) => {
      this.currentActivityType.set(type);
      this.updateMetadataForm(type);
    });

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
          caloriesBurned: activity.caloriesBurned ?? '',
          description: activity.description ?? '',
          notes: activity.notes ?? ''
        });
        
        // Load metadata if it exists
        if (activity.metadata) {
          this.currentActivityType.set(activity.type);
          this.updateMetadataForm(activity.type);
          this.activityForm.get('metadata')?.patchValue(activity.metadata);
        }
        
        this.isLoading.set(false);
      },
      error: (error) => {
        this.snackBar.open('Failed to load activity', 'Close', { duration: 3000 });
        this.isLoading.set(false);
        this.goBack();
      }
    });
  }

  private updateMetadataForm(type: ActivityType) {
    const metadataGroup = this.activityForm.get('metadata') as FormGroup;
    
    // Clear existing controls
    Object.keys(metadataGroup.controls).forEach(key => {
      metadataGroup.removeControl(key);
    });

    // Add controls based on activity type
    switch (type) {
      case ActivityType.SWIMMING:
        metadataGroup.addControl('poolSize', this.fb.control('', [Validators.required, Validators.min(1)]));
        metadataGroup.addControl('laps', this.fb.control('', [Validators.required, Validators.min(1)]));
        metadataGroup.addControl('strokeType', this.fb.control(''));
        break;

      case ActivityType.RUNNING:
        metadataGroup.addControl('location', this.fb.control('', Validators.required));
        metadataGroup.addControl('distance', this.fb.control('', Validators.min(0.1)));
        metadataGroup.addControl('pace', this.fb.control('', Validators.min(1)));
        metadataGroup.addControl('elevation', this.fb.control('', Validators.min(0)));
        break;

      case ActivityType.CYCLING:
        metadataGroup.addControl('location', this.fb.control('', Validators.required));
        metadataGroup.addControl('distance', this.fb.control('', Validators.min(0.1)));
        metadataGroup.addControl('avgSpeed', this.fb.control('', Validators.min(1)));
        metadataGroup.addControl('elevation', this.fb.control('', Validators.min(0)));
        break;

      case ActivityType.SKATING:
        metadataGroup.addControl('type', this.fb.control('', Validators.required));
        metadataGroup.addControl('location', this.fb.control('', Validators.required));
        metadataGroup.addControl('distance', this.fb.control('', Validators.min(0.1)));
        break;

      case ActivityType.HORSE_RIDING:
        metadataGroup.addControl('discipline', this.fb.control('', Validators.required));
        metadataGroup.addControl('location', this.fb.control('', Validators.required));
        metadataGroup.addControl('horseName', this.fb.control(''));
        break;

      case ActivityType.GYM_WORKOUT:
        metadataGroup.addControl('workoutType', this.fb.control('', Validators.required));
        metadataGroup.addControl('exercises', this.fb.array([]));
        metadataGroup.addControl('equipment', this.fb.array([]));
        break;
    }
  }

  // Helper methods for dynamic arrays (gym workout)
  get exercisesArray(): FormArray {
    return this.activityForm.get('metadata.exercises') as FormArray;
  }

  get equipmentArray(): FormArray {
    return this.activityForm.get('metadata.equipment') as FormArray;
  }

  addExercise() {
    this.exercisesArray.push(this.fb.control('', Validators.required));
  }

  removeExercise(index: number) {
    this.exercisesArray.removeAt(index);
  }

  addEquipment() {
    this.equipmentArray.push(this.fb.control('', Validators.required));
  }

  removeEquipment(index: number) {
    this.equipmentArray.removeAt(index);
  }

  onSubmit() {
    if (this.activityForm.invalid) {
      this.activityForm.markAllAsTouched();
      return;
    }

    this.isSaving.set(true);
    const formValue = this.activityForm.value;
    
    // Build activity data with only defined optional fields
    const activityData: CreateActivityDto = {
      title: formValue.title,
      type: formValue.type,
      activityDate: formValue.activityDate.toISOString(),
      duration: formValue.duration,
      difficulty: formValue.difficulty
    };

    // Only include optional fields if they have values
    if (formValue.caloriesBurned != null && formValue.caloriesBurned > 0) {
      activityData.caloriesBurned = formValue.caloriesBurned;
    }
    
    if (formValue.description && formValue.description.trim()) {
      activityData.description = formValue.description.trim();
    }

    if (formValue.notes && formValue.notes.trim()) {
      activityData.notes = formValue.notes.trim();
    }

    const cleanedMetadata = this.getCleanedMetadata(formValue.metadata);
    if (cleanedMetadata && Object.keys(cleanedMetadata).length > 0) {
      activityData.metadata = cleanedMetadata;
    }

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

  private getCleanedMetadata(metadata: any): ActivityMetadata | undefined {
    if (!metadata || Object.keys(metadata).length === 0) {
      return undefined;
    }

    // Remove empty values and convert to appropriate types
    const cleaned: any = {};
    Object.keys(metadata).forEach(key => {
      const value = metadata[key];
      if (value !== null && value !== undefined && value !== '') {
        // Convert numeric strings to numbers for specific fields
        if (['poolSize', 'laps', 'distance', 'pace', 'elevation', 'avgSpeed'].includes(key)) {
          cleaned[key] = Number(value);
        } else if (Array.isArray(value)) {
          // Filter out empty array items
          const filteredArray = value.filter(item => item && item.trim());
          if (filteredArray.length > 0) {
            cleaned[key] = filteredArray;
          }
        } else {
          cleaned[key] = value;
        }
      }
    });

    return Object.keys(cleaned).length > 0 ? cleaned : undefined;
  }

  goBack() {
    this.router.navigate(['/activities']);
  }
}
