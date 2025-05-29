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
  templateUrl: './activity-form.component.html',
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
