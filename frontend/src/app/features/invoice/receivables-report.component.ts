import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterLink } from '@angular/router';
import { InvoiceService } from './invoice.service';

@Component({
  selector: 'app-receivables-report',
  standalone: true,
  imports: [CommonModule, RouterLink, MatCardModule, MatIconModule, MatButtonModule, MatTableModule, MatTabsModule, MatChipsModule],
  template: `
    <div class="report-container">
      <div class="header">
        <h1>Raport należności</h1>
        <button mat-raised-button color="primary" (click)="refresh()">
          <mat-icon>refresh</mat-icon> Odśwież
        </button>
      </div>

      <div class="summary-cards">
        <mat-card class="summary-card">
          <mat-card-content>
            <div class="summary-icon total">💰</div>
            <div class="summary-details">
              <span class="summary-label">Łączne należności</span>
              <span class="summary-value">{{ totalReceivables() | number:'1.2-2' }} PLN</span>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="summary-card">
          <mat-card-content>
            <div class="summary-icon overdue">⚠️</div>
            <div class="summary-details">
              <span class="summary-label">Zaległe (przeterminowane)</span>
              <span class="summary-value">{{ overdueTotal() | number:'1.2-2' }} PLN</span>
              <span class="summary-sub">({{ overdueCount() }} faktur)</span>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="summary-card">
          <mat-card-content>
            <div class="summary-icon coming">📅</div>
            <div class="summary-details">
              <span class="summary-label">Wymagalne w ciągu 7 dni</span>
              <span class="summary-value">{{ comingTotal() | number:'1.2-2' }} PLN</span>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <mat-tab-group class="report-tabs">
        <mat-tab label="Wszystkie niezapłacone">
          <div class="tab-content">
            <table mat-table [dataSource]="unpaidInvoices()" class="report-table">
              <ng-container matColumnDef="number">
                <th mat-header-cell *matHeaderCellDef>Numer</th>
                <td mat-cell *matCellDef="let inv"><a [routerLink]="['/invoices', inv.id]">{{ inv.number }}</a></td>
              </ng-container>
              <ng-container matColumnDef="client">
                <th mat-header-cell *matHeaderCellDef>Klient</th>
                <td mat-cell *matCellDef="let inv">{{ inv.clientName }}</td>
              </ng-container>
              <ng-container matColumnDef="dueDate">
                <th mat-header-cell *matHeaderCellDef>Termin</th>
                <td mat-cell *matCellDef="let inv">{{ inv.dueDate | date:'dd MMM yyyy' }}</td>
              </ng-container>
              <ng-container matColumnDef="remaining">
                <th mat-header-cell *matHeaderCellDef>Pozostało do zapłaty</th>
                <td mat-cell *matCellDef="let inv">{{ getRemainingAmount(inv) | number:'1.2-2' }} {{ inv.currency }}</td>
              </ng-container>
              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef>Status</th>
                <td mat-cell *matCellDef="let inv">
                  <mat-chip [class]="getStatusClass(inv.status)">{{ getStatusLabel(inv.status) }}</mat-chip>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>
          </div>
        </mat-tab>
        <mat-tab label="Przeterminowane">
          <div class="tab-content">
            <table mat-table [dataSource]="overdueInvoices()" class="report-table">
              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>
          </div>
        </mat-tab>
        <mat-tab label="Historia płatności">
          <div class="tab-content">
            <p class="coming-soon">Moduł w budowie – będzie zawierał listę wszystkich zarejestrowanych wpłat.</p>
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [`
    .report-container {
      padding: 24px;
      max-width: 1200px;
      margin: 0 auto;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;

      h1 {
        margin: 0;
        font-size: 2rem;
        font-weight: 400;
        color: #1e293b;
      }
    }
    .summary-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 32px;
    }
    .summary-card {
      .mat-mdc-card-content {
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 16px;
      }
      .summary-icon {
        font-size: 40px;
        width: 48px;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #f1f5f9;
        border-radius: 12px;
      }
      .summary-details {
        display: flex;
        flex-direction: column;
      }
      .summary-label {
        font-size: 0.8rem;
        color: #64748b;
        text-transform: uppercase;
      }
      .summary-value {
        font-size: 1.8rem;
        font-weight: 500;
        color: #0f172a;
      }
      .summary-sub {
        font-size: 0.8rem;
        color: #64748b;
      }
    }
    .report-tabs {
      .tab-content {
        padding: 24px 0;
      }
    }
    .report-table {
      width: 100%;
    }
    .coming-soon {
      text-align: center;
      padding: 48px;
      color: #94a3b8;
      font-style: italic;
    }
  `]
})
export class ReceivablesReportComponent {
  private invoiceService = inject(InvoiceService);
  private invoices = this.invoiceService.invoices;

  displayedColumns = ['number', 'client', 'dueDate', 'remaining', 'status'];

  // Wszystkie faktury niezapłacone (status sent lub overdue)
  unpaidInvoices = computed(() => {
    return this.invoices().filter(inv => inv.status === 'sent' || inv.status === 'overdue');
  });

  overdueInvoices = computed(() => {
    return this.invoices().filter(inv => inv.status === 'overdue');
  });

  totalReceivables = computed(() => {
    return this.unpaidInvoices().reduce((sum, inv) => sum + this.getRemainingAmount(inv), 0);
  });

  overdueTotal = computed(() => {
    return this.overdueInvoices().reduce((sum, inv) => sum + this.getRemainingAmount(inv), 0);
  });

  overdueCount = computed(() => this.overdueInvoices().length);

  comingTotal = computed(() => {
    const now = new Date();
    const nextWeek = new Date(now);
    nextWeek.setDate(now.getDate() + 7);
    return this.invoices()
      .filter(inv => inv.status === 'sent' && inv.dueDate <= nextWeek)
      .reduce((sum, inv) => sum + this.getRemainingAmount(inv), 0);
  });

  getRemainingAmount(inv: any): number {
    const paid = inv.payments.reduce((sum: number, p: any) => sum + p.amount, 0);
    return inv.totalGross - paid;
  }

  getStatusClass(status: string): string {
    const map: Record<string, string> = {
      sent: 'status-sent',
      overdue: 'status-overdue'
    };
    return map[status] || '';
  }

  getStatusLabel(status: string): string {
    return status === 'sent' ? 'Wysłana' : 'Zaległa';
  }

  refresh() {
    console.log('Odświeżanie raportu');
  }
}