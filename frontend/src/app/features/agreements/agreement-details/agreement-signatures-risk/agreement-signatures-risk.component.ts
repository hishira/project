import { Component, input } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { Agreement } from '../../types';

@Component({
  selector: 'app-agreement-signatures-risk',
  standalone: true,
  imports: [CommonModule, MatCardModule, DatePipe],
  template: `
    <mat-card class="mb-4">
      <mat-card-header>
        <mat-card-title>Dodatkowe informacje</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <div class="row">
          <div class="col-6">
            <h6>Podpisy:</h6>
            @if (agreement().signatures && agreement().signatures.length > 0) {
              @for (signature of agreement().signatures; track signature.userId) {
                <div class="mb-2">
                  <p class="mb-0"><small>Użytkownik: {{ signature.userId }}</small></p>
                  <p class="mb-0"><small>Data: {{ signature.signedAt | date: 'dd.MM.yyyy' }}</small></p>
                </div>
              }
            } @else {
              <p class="text-muted"><small>Brak podpisów</small></p>
            }
          </div>
          <div class="col-6">
            <h6>Ocena ryzyka:</h6>
            <div class="risk-assessment" [class]="getRiskClass(agreement().riskAssessment.level)">
              <p class="mb-1"><strong>Poziom: {{ agreement().riskAssessment.level }}</strong></p>
              <p class="mb-0">Wynik: {{ agreement().riskAssessment.score }}</p>
            </div>
          </div>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .risk-assessment {
      padding: 12px;
      border-radius: 8px;
      margin-top: 8px;
    }
    .risk-assessment.low { background-color: #e8f5e9; border-left: 4px solid #4caf50; }
    .risk-assessment.medium { background-color: #fff3e0; border-left: 4px solid #ff9800; }
    .risk-assessment.high { background-color: #ffebee; border-left: 4px solid #f44336; }
  `]
})
export class AgreementSignaturesRiskComponent {
  agreement = input.required<Agreement>();

  getRiskClass(level: string): string {
    return level.toLowerCase();
  }
}
