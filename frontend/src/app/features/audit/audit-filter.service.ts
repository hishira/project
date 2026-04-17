import { Injectable, signal } from '@angular/core';
import { AuditLog, AuditEntityType, AuditActionType, AuditSeverity } from './audit.model';

@Injectable({ providedIn: 'root' })
export class AuditFilterService {
    readonly filterSearch = signal<string>('');
    readonly filterEntityType = signal<AuditEntityType | ''>('');
    readonly filterAction = signal<AuditActionType | ''>('');
    readonly filterSeverity = signal<AuditSeverity | ''>('');
    readonly filterDateFrom = signal<Date | null>(null);
    readonly filterDateTo = signal<Date | null>(null);

    getFilterString(): string {
        const filterObj = {
            search: this.filterSearch(),
            entityType: this.filterEntityType(),
            action: this.filterAction(),
            severity: this.filterSeverity(),
            dateFrom: this.filterDateFrom(),
            dateTo: this.filterDateTo(),
        };
        return JSON.stringify(filterObj);
    }

    clearFilters(): void {
        this.filterSearch.set('');
        this.filterEntityType.set('');
        this.filterAction.set('');
        this.filterSeverity.set('');
        this.filterDateFrom.set(null);
        this.filterDateTo.set(null);
    }

    filterPredicate = (data: AuditLog, filter: string): boolean => {
        const filterObj = JSON.parse(filter);

        if (filterObj.search) {
            const search = filterObj.search.toLowerCase();
            const matchesSearch =
                data.entityName.toLowerCase().includes(search) ||
                data.userName.toLowerCase().includes(search) ||
                data.description.toLowerCase().includes(search);
            if (!matchesSearch) return false;
        }

        if (filterObj.entityType && data.entityType !== filterObj.entityType) return false;
        if (filterObj.action && data.action !== filterObj.action) return false;
        if (filterObj.severity && data.severity !== filterObj.severity) return false;
        if (filterObj.dateFrom && new Date(data.timestamp) < new Date(filterObj.dateFrom)) return false;
        if (filterObj.dateTo && new Date(data.timestamp) > new Date(filterObj.dateTo)) return false;

        return true;
    };
}