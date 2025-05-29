import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivityService } from '../../../core/services/activity.service';
import { Activity } from '../../../shared/models/activity.model';
import { format } from 'date-fns';

@Component({
  selector: 'app-activity-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatMenuModule
  ],
  templateUrl: './activity-detail.component.html',
  styleUrls: ['./activity-detail.component.scss']
})
export class ActivityDetailComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  public readonly activityService = inject(ActivityService);
  private readonly snackBar = inject(MatSnackBar);

  activity = signal<Activity | null>(null);
  isLoading = signal(false);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadActivity(id);
    }
  }

  private loadActivity(id: string) {
    this.isLoading.set(true);
    this.activityService.getActivity(id).subscribe({
      next: (activity) => {
        this.activity.set(activity);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.snackBar.open('Failed to load activity', 'Close', { duration: 3000 });
        this.isLoading.set(false);
      }
    });
  }

  editActivity() {
    if (this.activity()) {
      this.router.navigate(['/activities/edit', this.activity()!.id]);
    }
  }

  deleteActivity() {
    if (!this.activity()) return;

    if (confirm('Are you sure you want to delete this activity? This action cannot be undone.')) {
      this.activityService.deleteActivity(this.activity()!.id).subscribe({
        next: () => {
          this.snackBar.open('Activity deleted successfully', 'Close', { duration: 3000 });
          this.router.navigate(['/activities']);
        },
        error: () => {
          this.snackBar.open('Failed to delete activity', 'Close', { duration: 3000 });
        }
      });
    }
  }

  goBack() {
    this.router.navigate(['/activities']);
  }

  formatDate(date: string): string {
    return format(new Date(date), 'EEEE, MMMM do, yyyy');
  }

  formatTime(date: string): string {
    return format(new Date(date), 'HH:mm');
  }

  formatDateTime(date: string): string {
    return format(new Date(date), 'MMM dd, yyyy at HH:mm');
  }

  getIntensityScore(): string {
    const activity = this.activity();
    if (!activity) return '0';
    
    const difficultyScores = {
      1: '2',
      2: '4', 
      3: '6',
      4: '8',
      5: '10'
    };
    
    return difficultyScores[activity.difficulty] || '0';
  }

  // Metadata helper methods
  hasMetadata(): boolean {
    const activity = this.activity();
    return !!(activity?.metadata && Object.keys(activity.metadata).length > 0);
  }

  getMetadataValue(key: string): any {
    const activity = this.activity();
    if (!activity?.metadata) return null;
    return activity.metadata[key as keyof typeof activity.metadata];
  }

  getMetadataArrayValue(key: string): string[] {
    const value = this.getMetadataValue(key);
    return Array.isArray(value) ? value : [];
  }

  capitalizeFirst(str: string): string {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  formatSkatingType(type: string): string {
    const types: { [key: string]: string } = {
      'ice': 'Ice Skating',
      'roller': 'Roller Skating', 
      'inline': 'Inline Skating'
    };
    return types[type] || this.capitalizeFirst(type);
  }

  formatWorkoutType(type: string): string {
    const types: { [key: string]: string } = {
      'strength': 'Strength Training',
      'cardio': 'Cardio',
      'mixed': 'Mixed Training'
    };
    return types[type] || this.capitalizeFirst(type);
  }
}
