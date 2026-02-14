import { Component, input, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { AgreementDetailStore } from '../agreement-details.store';

export interface PaymentScheduleItem {
    installmentNumber: number;
    dueDate: Date | string;
    amount: number;
    status: string;
}

@Component({
    selector: 'app-payment-schedule',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        CommonModule,
        MatCardModule,
        MatTableModule
    ],
    providers: [DatePipe],
    templateUrl: './agreement-payments.component.html',
    styles: [`
    .w-100 {
      width: 100%;
    }
    .mb-4 {
      margin-bottom: 1.5rem;
    }
    .text-muted {
      color: rgba(0, 0, 0, 0.6);
    }
    .payment-status {
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.875rem;
      font-weight: 500;
    }
    .payment-status.paid {
      background-color: #e8f5e8;
      color: #2e7d32;
    }
    .payment-status.pending {
      background-color: #fff3e0;
      color: #b85c00;
    }
    .payment-status.overdue {
      background-color: #ffebee;
      color: #c62828;
    }
  `]
})
export class PaymentScheduleComponent {
    readonly agreementStore = inject(AgreementDetailStore)
    readonly paymentSchedule = this.agreementStore.paymentSchedule;
    readonly currency = this.agreementStore.currency();
    readonly displayedColumns: string[] = ['installmentNumber', 'dueDate', 'amount', 'status'];

    getPaymentStatusClass(status: string): string {
        return status.toLowerCase();
    }
}