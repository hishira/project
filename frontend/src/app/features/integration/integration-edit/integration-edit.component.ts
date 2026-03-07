import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { IntegrationService } from '../integration.service';
import { EmailIntegration } from '../integration.model';

@Component({
  selector: 'app-integration-edit',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatSelectModule
  ],
  template: `
    <div class="edit-container">
      <div class="header">
        <a mat-icon-button routerLink=".." class="back-btn">
          <mat-icon>arrow_back</mat-icon>
        </a>
        <h1>{{ integrationId ? 'Edytuj' : 'Nowa' }} integrację</h1>
      </div>

      <mat-card>
        <mat-card-content>
          <form [formGroup]="form" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Nazwa integracji</mat-label>
              <input matInput formControlName="name" required>
            </mat-form-field>

            <!-- Pola specyficzne dla e-mail -->
            <div formGroupName="config">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Serwer IMAP</mat-label>
                <input matInput formControlName="imapHost" required>
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Port IMAP</mat-label>
                <input matInput type="number" formControlName="imapPort" required>
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Serwer SMTP</mat-label>
                <input matInput formControlName="smtpHost" required>
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Port SMTP</mat-label>
                <input matInput type="number" formControlName="smtpPort" required>
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Nazwa użytkownika</mat-label>
                <input matInput formControlName="username" required>
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Hasło</mat-label>
                <input matInput type="password" formControlName="password">
              </mat-form-field>

              <mat-checkbox formControlName="useSSL">Użyj SSL</mat-checkbox>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Folder (np. INBOX)</mat-label>
                <input matInput formControlName="folder" required>
              </mat-form-field>
            </div>

            <div class="form-actions">
              <button mat-stroked-button type="button" routerLink="..">Anuluj</button>
              <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid">Zapisz</button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .edit-container {
      padding: 24px;
      max-width: 600px;
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
      margin-top: 24px;
    }
  `]
})
export class IntegrationEditComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private integrationService = inject(IntegrationService);

  integrationId: string | null = null;
  form: FormGroup;

  constructor() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      config: this.fb.group({
        imapHost: ['', Validators.required],
        imapPort: [993, [Validators.required, Validators.min(1), Validators.max(65535)]],
        smtpHost: ['', Validators.required],
        smtpPort: [587, [Validators.required, Validators.min(1), Validators.max(65535)]],
        username: ['', Validators.required],
        password: [''],
        useSSL: [true],
        folder: ['INBOX', Validators.required]
      })
    });
  }

  ngOnInit(): void {
    this.integrationId = this.route.snapshot.paramMap.get('id');
    if (this.integrationId) {
      const existing = this.integrationService.getIntegrationById(this.integrationId);
      if (existing && existing.type === 'email') {
        this.form.patchValue({
          name: existing.name,
          config: (existing as EmailIntegration).config
        });
      }
    }
  }

  onSubmit() {
    if (this.form.valid) {
      console.log('Zapisywanie integracji:', this.form.value);
      // Tutaj zapis do serwisu/API
      this.router.navigate(['..'], { relativeTo: this.route });
    }
  }
}