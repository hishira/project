/* eslint-disable max-lines */
import { ChangeDetectionStrategy, Component, inject, signal } from "@angular/core";
import { CommonRouterService } from '../../../core/services/common-router.service';
import { agreementRiskColorMap, agreementStatusColorMap } from '../../agreements/agreement-details/utils';
import { AgreementRiskStatus, AgreementStatus, AgreementStatusColor } from '../../agreements/types';
import { smnallSamples } from './mocks';
import { AgreementTableItem } from "./types";
import { imports } from './user-agreements.component.dependencies';

@Component({
    selector: 'app-user-agreements',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './user-agreements.component.html',
    styleUrls: ['./user-agreements.component.scss'],
    standalone: true,
    imports: [
        ...imports
    ],
    providers: [CommonRouterService]

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

    private readonly router = inject(CommonRouterService);
    readonly agreements = signal<AgreementTableItem[]>(smnallSamples as AgreementTableItem[]);

    expandedElement: AgreementTableItem | null = null;

    getStatusColor(status: AgreementStatus): AgreementStatusColor {
        return agreementStatusColorMap(status)
    }

    getRiskColor(riskLevel: AgreementRiskStatus): AgreementStatusColor {
        return agreementRiskColorMap(riskLevel);
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

    goToDetails(): void {
        this.router.navitgateTo(['agreements/details/test-id'], false);
    }

}