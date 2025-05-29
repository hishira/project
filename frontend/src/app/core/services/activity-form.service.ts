import { Injectable, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivityType } from '../../shared/models/activity.model';
import { MetadataFieldConfig, ACTIVITY_METADATA_FIELD_CONFIGS } from '../constants/activity-form.constants';

@Injectable({
  providedIn: 'root'
})
export class ActivityFormService {
  private readonly fb = inject(FormBuilder);

  /**
   * Create the main activity form with base fields
   */
  createActivityForm(): FormGroup {
    return this.fb.group({
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
  }

  /**
   * Update metadata form based on activity type
   */
  updateMetadataForm(form: FormGroup, activityType: ActivityType): void {
    const metadataGroup = form.get('metadata') as FormGroup;
    
    // Clear existing controls
    this.clearFormGroupControls(metadataGroup);

    // Add controls based on activity type
    const fieldConfigs = this.getMetadataFieldConfigs(activityType);
    this.addControlsToFormGroup(metadataGroup, fieldConfigs);
  }

  /**
   * Get metadata field configurations for each activity type
   */
  private getMetadataFieldConfigs(type: ActivityType): MetadataFieldConfig[] {
    return ACTIVITY_METADATA_FIELD_CONFIGS[type] || [];
  }

  /**
   * Get form arrays for dynamic fields (gym workout)
   */
  getExercisesArray(form: FormGroup): FormArray {
    return form.get('metadata.exercises') as FormArray;
  }

  getEquipmentArray(form: FormGroup): FormArray {
    return form.get('metadata.equipment') as FormArray;
  }

  /**
   * Add exercise to form array
   */
  addExercise(form: FormGroup): void {
    const exercisesArray = this.getExercisesArray(form);
    exercisesArray.push(this.fb.control('', Validators.required));
  }

  /**
   * Remove exercise from form array
   */
  removeExercise(form: FormGroup, index: number): void {
    const exercisesArray = this.getExercisesArray(form);
    exercisesArray.removeAt(index);
  }

  /**
   * Add equipment to form array
   */
  addEquipment(form: FormGroup): void {
    const equipmentArray = this.getEquipmentArray(form);
    equipmentArray.push(this.fb.control('', Validators.required));
  }

  /**
   * Remove equipment from form array
   */
  removeEquipment(form: FormGroup, index: number): void {
    const equipmentArray = this.getEquipmentArray(form);
    equipmentArray.removeAt(index);
  }

  /**
   * Private helper methods
   */
  private clearFormGroupControls(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      formGroup.removeControl(key);
    });
  }

  private addControlsToFormGroup(formGroup: FormGroup, configs: MetadataFieldConfig[]): void {
    configs.forEach(config => {
      if (config.type === 'array') {
        formGroup.addControl(config.name, this.fb.array([]));
      } else {
        const validators = config.validators || [];
        formGroup.addControl(config.name, this.fb.control('', validators));
      }
    });
  }
}
