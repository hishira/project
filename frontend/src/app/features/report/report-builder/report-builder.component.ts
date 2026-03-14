import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-report-builder',
  standalone: true,
  imports: [
    CommonModule, RouterLink,
    MatCardModule, MatStepperModule,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatButtonModule, MatIconModule,
    FormsModule, ReactiveFormsModule
  ],
  template: `
    <div class="builder-container">
      <div class="header">
        <a mat-icon-button routerLink="/analytics/reports" class="back-btn">
          <mat-icon>arrow_back</mat-icon>
        </a>
        <h1>Kreator raportów</h1>
      </div>

      <mat-stepper linear #stepper>
        <mat-step [stepControl]="basicForm">
          <form [formGroup]="basicForm">
            <ng-template matStepLabel>Podstawowe informacje</ng-template>
            <mat-card>
              <mat-card-content>
                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Nazwa raportu</mat-label>
                  <input matInput formControlName="name" required>
                </mat-form-field>
                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Opis</mat-label>
                  <textarea matInput formControlName="description" rows="2"></textarea>
                </mat-form-field>
                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Typ raportu</mat-label>
                  <mat-select formControlName="type" required>
                    <mat-option value="sales">Sprzedaż</mat-option>
                    <mat-option value="support">Obsługa</mat-option>
                    <mat-option value="marketing">Marketing</mat-option>
                    <mat-option value="finance">Finanse</mat-option>
                  </mat-select>
                </mat-form-field>
              </mat-card-content>
              <mat-card-actions>
                <button mat-button matStepperNext>Dalej</button>
              </mat-card-actions>
            </mat-card>
          </form>
        </mat-step>

        <mat-step>
          <ng-template matStepLabel>Źródło danych i miary</ng-template>
          <mat-card>
            <mat-card-content>
              <p>Wybór źródła danych (tabeli) oraz definiowanie miar (agregacji).</p>
              <!-- W praktyce rozbudowany formularz z listą pól -->
            </mat-card-content>
            <mat-card-actions>
              <button mat-button matStepperPrevious>Wstecz</button>
              <button mat-button matStepperNext>Dalej</button>
            </mat-card-actions>
          </mat-card>
        </mat-step>

        <mat-step>
          <ng-template matStepLabel>Wymiary i filtry</ng-template>
          <mat-card>
            <mat-card-content>
              <p>Definiowanie wymiarów (grupowania) oraz filtrów.</p>
            </mat-card-content>
            <mat-card-actions>
              <button mat-button matStepperPrevious>Wstecz</button>
              <button mat-button matStepperNext>Dalej</button>
            </mat-card-actions>
          </mat-card>
        </mat-step>

        <mat-step>
          <ng-template matStepLabel>Wizualizacja</ng-template>
          <mat-card>
            <mat-card-content>
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Typ wykresu</mat-label>
                <mat-select>
                  <mat-option value="bar">Słupkowy</mat-option>
                  <mat-option value="line">Liniowy</mat-option>
                  <mat-option value="pie">Kołowy</mat-option>
                  <mat-option value="table">Tabela</mat-option>
                </mat-select>
              </mat-form-field>
            </mat-card-content>
            <mat-card-actions>
              <button mat-button matStepperPrevious>Wstecz</button>
              <button mat-raised-button color="primary">Zapisz raport</button>
            </mat-card-actions>
          </mat-card>
        </mat-step>
      </mat-stepper>
    </div>
  `,
  styles: [`
    .builder-container {
      padding: 24px;
      max-width: 800px;
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
  `]
})
export class ReportBuilderComponent {
  private fb = inject(FormBuilder);
  basicForm = this.fb.group({
    name: ['', Validators.required],
    description: [''],
    type: ['', Validators.required]
  });
}