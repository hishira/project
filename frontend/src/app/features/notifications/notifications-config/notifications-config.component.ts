import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { RouterLink } from '@angular/router';
import { PageHeaderComponent } from '../../../core/components/page-header/page-header.component';
import { MainPageViewComponent } from '../../../core/components/main-page-view/main-page-view.component';
import { NotificationsService } from '../notifications.service';
import { NotificationConfig, NotificationCategory, NotificationChannel } from '../notifications.model';
import { NOTIFICATION_CATEGORIES } from '../notifications.constants';

@Component({
  selector: 'app-notifications-config',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatCheckboxModule,
    MatDividerModule,
    MatSnackBarModule,
    PageHeaderComponent,
    MainPageViewComponent
  ],
  templateUrl: './notifications-config.component.html',
  styleUrls: ['./notifications-config.component.scss']
})
export class NotificationsConfigComponent implements OnInit {
  private fb = inject(FormBuilder);
  private notificationsService = inject(NotificationsService);
  private snackBar = inject(MatSnackBar);

  configForm!: FormGroup;
  isLoading = signal(false);
  isSaving = signal(false);

  categories: { key: NotificationCategory; label: string }[] = NOTIFICATION_CATEGORIES;

  ngOnInit(): void {
    this.initializeForm();
    this.loadConfig();
  }

  private initializeForm(): void {
    this.configForm = this.fb.group({
      emailEnabled: [false],
      smsEnabled: [false],
      pushEnabled: [false],
      webSocketEnabled: [true],
      quietHours: this.fb.group({
        enabled: [false],
        start: ['22:00'],
        end: ['08:00']
      }),
      categories: this.fb.array([])
    });

    // Initialize category controls
    this.categories.forEach(category => {
      const categoryGroup = this.fb.group({
        category: [category.key],
        channels: this.fb.group({
          email: [false],
          sms: [false],
          push: [true],
          webSocket: [true]
        })
      });
      this.categoryControls.push(categoryGroup);
    });
  }

  private loadConfig(): void {
    this.isLoading.set(true);
    this.notificationsService.getConfig().subscribe(config => {
      if (config) {
        this.configForm.patchValue({
          emailEnabled: config.emailEnabled,
          smsEnabled: config.smsEnabled,
          pushEnabled: config.pushEnabled,
          webSocketEnabled: config.webSocketEnabled,
          quietHours: config.quietHours
        });

        // Update category controls
        config.categories.forEach(catConfig => {
          const control = this.categoryControls.controls.find(
            c => c.get('category')?.value === catConfig.category
          );
          if (control) {
            control.patchValue(catConfig);
          }
        });
      }
      this.isLoading.set(false);
    });
  }

  get categoryControls(): FormArray {
    return this.configForm.get('categories') as FormArray;
  }

  getCategoryLabel(category: NotificationCategory): string {
    return this.categories.find(c => c.key === category)?.label || category;
  }

  onSave(): void {
    if (this.configForm.valid) {
      this.isSaving.set(true);

      const formValue = this.configForm.value;
      const config: NotificationConfig = {
        id: 'config-1', // In real app, this would come from the loaded config
        userId: 'current-user',
        emailEnabled: formValue.emailEnabled,
        smsEnabled: formValue.smsEnabled,
        pushEnabled: formValue.pushEnabled,
        webSocketEnabled: formValue.webSocketEnabled,
        categories: formValue.categories,
        quietHours: formValue.quietHours
      };

      this.notificationsService.updateConfig(config).subscribe({
        next: () => {
          this.snackBar.open('Konfiguracja powiadomień została zapisana', 'OK', {
            duration: 3000
          });
          this.isSaving.set(false);
        },
        error: () => {
          this.snackBar.open('Błąd podczas zapisywania konfiguracji', 'OK', {
            duration: 3000
          });
          this.isSaving.set(false);
        }
      });
    }
  }

  onReset(): void {
    this.loadConfig();
    this.snackBar.open('Konfiguracja została przywrócona', 'OK', {
      duration: 2000
    });
  }

  toggleAllForChannel(channel: NotificationChannel, enabled: boolean): void {
    this.categoryControls.controls.forEach(control => {
      control.get('channels')?.get(channel)?.setValue(enabled);
    });
  }

  isAllSelectedForChannel(channel: NotificationChannel): boolean {
    return this.categoryControls.controls.every(control => control.get('channels')?.get(channel)?.value);
  }

  isSomeSelectedForChannel(channel: NotificationChannel): boolean {
    const selectedCount = this.categoryControls.controls.filter(control => control.get('channels')?.get(channel)?.value).length;
    return selectedCount > 0 && selectedCount < this.categoryControls.length;
  }
}