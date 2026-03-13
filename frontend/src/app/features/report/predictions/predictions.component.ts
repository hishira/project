import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { AnalyticsService } from '../analytics.service';
import { MatChipsModule } from '@angular/material/chips';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-predictions',
  standalone: true,
  imports: [CommonModule, RouterLink, MatCardModule, MatTabsModule, MatTableModule, MatChipsModule, MatListModule],
  template: `
    <div class="predictions-container">
      <h1>Analityka predykcyjna</h1>
      <mat-tab-group>
        <mat-tab label="Churn – odejścia klientów">
          <mat-card>
            <mat-card-content>
              <table mat-table [dataSource]="churnPredictions()" class="full-width">
                <ng-container matColumnDef="clientName">
                  <th mat-header-cell *matHeaderCellDef>Klient</th>
                  <td mat-cell *matCellDef="let p">{{ p.clientName }}</td>
                </ng-container>
                <ng-container matColumnDef="probability">
                  <th mat-header-cell *matHeaderCellDef>Prawdopodobieństwo</th>
                  <td mat-cell *matCellDef="let p">{{ p.probability | percent:'1.0-0' }}</td>
                </ng-container>
                <ng-container matColumnDef="riskLevel">
                  <th mat-header-cell *matHeaderCellDef>Ryzyko</th>
                  <td mat-cell *matCellDef="let p">
                    <mat-chip [class]="'risk-' + p.riskLevel">{{ p.riskLevel }}</mat-chip>
                  </td>
                </ng-container>
                <ng-container matColumnDef="predictedDate">
                  <th mat-header-cell *matHeaderCellDef>Przewidywana data</th>
                  <td mat-cell *matCellDef="let p">{{ p.predictedDate | date:'dd MMM yyyy' }}</td>
                </ng-container>
                <tr mat-header-row *matHeaderRowDef="['clientName', 'probability', 'riskLevel', 'predictedDate']"></tr>
                <tr mat-row *matRowDef="let row; columns: ['clientName', 'probability', 'riskLevel', 'predictedDate'];"></tr>
              </table>
            </mat-card-content>
          </mat-card>
        </mat-tab>
        <mat-tab label="Szanse powodzenia ofert">
          <mat-card>
            <mat-card-content>
              <table mat-table [dataSource]="opportunityPredictions()" class="full-width">
                <ng-container matColumnDef="opportunityName">
                  <th mat-header-cell *matHeaderCellDef>Oferta</th>
                  <td mat-cell *matCellDef="let o">{{ o.opportunityName }}</td>
                </ng-container>
                <ng-container matColumnDef="winProbability">
                  <th mat-header-cell *matHeaderCellDef>Szansa</th>
                  <td mat-cell *matCellDef="let o">{{ o.winProbability | percent:'1.0-0' }}</td>
                </ng-container>
                <ng-container matColumnDef="expectedRevenue">
                  <th mat-header-cell *matHeaderCellDef>Przewidywany przychód</th>
                  <td mat-cell *matCellDef="let o">{{ o.expectedRevenue | currency:'PLN' }}</td>
                </ng-container>
                <ng-container matColumnDef="predictedCloseDate">
                  <th mat-header-cell *matHeaderCellDef>Przewidywana data</th>
                  <td mat-cell *matCellDef="let o">{{ o.predictedCloseDate | date:'dd MMM yyyy' }}</td>
                </ng-container>
                <tr mat-header-row *matHeaderRowDef="['opportunityName', 'winProbability', 'expectedRevenue', 'predictedCloseDate']"></tr>
                <tr mat-row *matRowDef="let row; columns: ['opportunityName', 'winProbability', 'expectedRevenue', 'predictedCloseDate'];"></tr>
              </table>
            </mat-card-content>
          </mat-card>
        </mat-tab>
        <mat-tab label="Modele">
          <mat-card>
            <mat-card-content>
              <mat-list>
                @for (model of predictionModels(); track model.id) {
                  <mat-list-item>
                    <div class="model-item">
                      <span>{{ model.name }}</span>
                      <span>Dokładność: {{ model.accuracy | percent:'1.0-0' }}</span>
                      <mat-chip [class]="model.status === 'active' ? 'status-active' : 'status-inactive'">
                        {{ model.status }}
                      </mat-chip>
                    </div>
                  </mat-list-item>
                }
              </mat-list>
            </mat-card-content>
          </mat-card>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [`
    .predictions-container {
      padding: 24px;
      max-width: 1200px;
      margin: 0 auto;
    }
    h1 {
      margin: 0 0 24px 0;
      font-size: 2rem;
      font-weight: 400;
      color: #1e293b;
    }
    .full-width {
      width: 100%;
    }
    .model-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      gap: 16px;
    }
    .status-active { background-color: #d1fae5 !important; color: #065f46 !important; }
    .status-inactive { background-color: #e2e8f0 !important; color: #475569 !important; }
    .risk-low { background-color: #d1fae5 !important; color: #065f46 !important; }
    .risk-medium { background-color: #fef3c7 !important; color: #92400e !important; }
    .risk-high { background-color: #fee2e2 !important; color: #b91c1c !important; }
  `]
})
export class PredictionsComponent {
  private analyticsService = inject(AnalyticsService);
  predictionModels = this.analyticsService.predictionModels;
  churnPredictions = this.analyticsService.churnPredictions;
  opportunityPredictions = this.analyticsService.opportunityPredictions;
}