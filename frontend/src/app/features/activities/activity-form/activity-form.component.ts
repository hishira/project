import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormArray } from '@angular/forms';
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
import { ActivityFormService } from '../../../core/services/activity-form.service';
import { ActivityFormValidatorService } from '../../../core/services/activity-form-validator.service';
import { 
  ActivityType, 
  DifficultyLevel
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
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  public readonly activityService = inject(ActivityService);
  private readonly formService = inject(ActivityFormService);
  private readonly validatorService = inject(ActivityFormValidatorService);
  private readonly snackBar = inject(MatSnackBar);

  activityForm: FormGroup = this.formService.createActivityForm();

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
    this.setupFormSubscriptions();
    this.checkForEditMode();
  }

  /**
   * Setup form value change subscriptions
   */
  private setupFormSubscriptions(): void {
    this.activityForm.get('type')?.valueChanges.subscribe((type: ActivityType) => {
      this.currentActivityType.set(type);
      this.formService.updateMetadataForm(this.activityForm, type);
    });
  }

  /**
   * Check if this is edit mode and load activity if needed
   */
  private checkForEditMode(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.activityId.set(id);
      this.loadActivity(id);
    }
  }

  /**
   * Load activity for editing
   */
  private loadActivity(id: string): void {
    this.isLoading.set(true);
    
    this.activityService.getActivity(id).subscribe({
      next: (activity) => {
        this.populateFormWithActivity(activity);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.handleLoadError();
      }
    });
  }

  /**
   * Populate form with loaded activity data
   */
  private populateFormWithActivity(activity: any): void {
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
      this.formService.updateMetadataForm(this.activityForm, activity.type);
      this.activityForm.get('metadata')?.patchValue(activity.metadata);
    }
  }

  /**
   * Handle activity loading error
   */
  private handleLoadError(): void {
    this.snackBar.open('Failed to load activity', 'Close', { duration: 3000 });
    this.isLoading.set(false);
    this.goBack();
  }

  // Helper methods for dynamic arrays (gym workout)
  get exercisesArray(): FormArray {
    return this.formService.getExercisesArray(this.activityForm);
  }

  get equipmentArray(): FormArray {
    return this.formService.getEquipmentArray(this.activityForm);
  }

  addExercise(): void {
    this.formService.addExercise(this.activityForm);
  }

  removeExercise(index: number): void {
    this.formService.removeExercise(this.activityForm, index);
  }

  addEquipment(): void {
    this.formService.addEquipment(this.activityForm);
  }

  removeEquipment(index: number): void {
    this.formService.removeEquipment(this.activityForm, index);
  }

  /**
   * Handle form submission
   */
  onSubmit(): void {
    if (this.activityForm.invalid) {
      this.activityForm.markAllAsTouched();
      return;
    }

    this.isSaving.set(true);
    const activityData = this.validatorService.transformFormToDto(this.activityForm.value);

    const operation = this.isEditMode() 
      ? this.activityService.updateActivity(this.activityId()!, activityData)
      : this.activityService.createActivity(activityData);

    operation.subscribe({
      next: (activity) => {
        this.handleSubmitSuccess(activity);
      },
      error: (error) => {
        this.handleSubmitError();
      }
    });
  }

  /**
   * Handle successful form submission
   */
  private handleSubmitSuccess(activity: any): void {
    const message = this.isEditMode() ? 'Activity updated successfully' : 'Activity created successfully';
    this.snackBar.open(message, 'Close', { duration: 3000 });
    this.isSaving.set(false);
    this.router.navigate(['/activities', activity.id]);
  }

  /**
   * Handle form submission error
   */
  private handleSubmitError(): void {
    const message = this.isEditMode() ? 'Failed to update activity' : 'Failed to create activity';
    this.snackBar.open(message, 'Close', { duration: 3000 });
    this.isSaving.set(false);
  }

  /**
   * Navigate back to activities list
   */
  goBack(): void {
    this.router.navigate(['/activities']);
  }
}
