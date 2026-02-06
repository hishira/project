/* eslint-disable max-lines */
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from "@angular/core";
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UserAgreementExpandedRow } from './expanded-row/expanded-row.component';
import { smnallSamples } from './mocks';
import { AgreementTableItem } from "./types";

@Component({
    selector: 'app-user-agreements',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './user-agreements.component.html',
    styleUrls: ['./user-agreements.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        MatTableModule,
        MatIconModule,
        MatButtonModule,
        MatCardModule,
        MatChipsModule,
        MatExpansionModule,
        MatTooltipModule,
        MatProgressBarModule,
        MatMenuModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatDividerModule,
        UserAgreementExpandedRow
    ],

})
export class UserAgreementsComponent {
    displayedColumns: string[] = [
        'expand',
        'contractId',
        'title',
        'status',
        'product',
        'parties',
        'dates',
        'value',
        'risk',
        'signatures',
        'actions'
    ];

    readonly agreements = signal<AgreementTableItem[]>(smnallSamples as AgreementTableItem[]);

    expandedElement: AgreementTableItem | null = null;

    getStatusColor(status: string): string {
        switch (status) {
            case 'ACTIVE': return 'accent';
            case 'EXPIRED': return 'warn';
            case 'PENDING_APPROVAL': return 'primary';
            case 'DRAFT': return 'basic';
            case 'SUSPENDED': return 'warn';
            default: return 'basic';
        }
    }

    getRiskColor(riskLevel: string): string {
        switch (riskLevel) {
            case 'LOW': return 'accent';
            case 'MEDIUM': return 'primary';
            case 'HIGH': return 'warn';
            case 'CRITICAL': return 'warn';
            default: return 'basic';
        }
    }

    getDaysUntilExpiration(expirationDate: Date): number {
        const now = new Date();
        const exp = new Date(expirationDate);
        const diffTime = exp.getTime() - now.getTime();
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    formatCurrency(value: number, currency: string): string {
        if (!value || !currency) return 'N/A';

        try {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: currency,
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }).format(value);
        } catch {
            return `${value} ${currency}`;
        }
    }

    formatDate(date: Date | string | undefined): string {
        if (!date) return 'N/A';

        const dateObj = typeof date === 'string' ? new Date(date) : date;

        if (isNaN(dateObj.getTime())) return 'Invalid date';

        return dateObj.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    toggleRow(element: AgreementTableItem): void {
        this.expandedElement = this.expandedElement === element ? null : element;
    }

    getPendingPayment(paymentSchedule: any[]): any {
        return paymentSchedule?.find(p => p.status === 'PENDING');
    }

}