import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { AgreementTableItem } from "../types";
import { imports } from "./expand-row.component.dependencies";

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: '[appUserAgreementExpandRow]',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './expanded-row.component.html',
    styleUrls: [
        './expans-row.scss'
    ],
    imports: [
        ...imports],
})
export class UserAgreementExpandedRow {
    readonly expandedElement = input<AgreementTableItem | null>(null);
    readonly element = input.required<AgreementTableItem | any>();
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


    getPendingPayment(paymentSchedule: any[]): any {
        return paymentSchedule?.find(p => p.status === 'PENDING');
    }


}