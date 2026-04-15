import { ChangeDetectionStrategy, Component, inject, signal, viewChild, AfterViewInit } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe, TitleCasePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { PageHeaderComponent } from '../../../core/components/page-header/page-header.component';
import { MainPageViewComponent } from '../../../core/components/main-page-view/main-page-view.component';
import { AuditLog, AUDIT_ENTITY_LABELS, AUDIT_ACTION_LABELS, AuditEntityType, AuditActionType, AuditSeverity } from '../audit.model';
import { AuditService } from '../audit.service';
import { AuditFiltersComponent } from '../audit-filters/audit-filters.component';
import {
    getAuditActionIcon,
    getActionSeverityColor,
    getActionChipClass,
    getEntityTypeIcon,
} from '../audit.utils';

@Component({
    selector: 'app-audit-list',
    standalone: true,
    imports: [
        CommonModule,
        RouterLink,
        MatTableModule,
        MatSortModule,
        MatPaginatorModule,
        MatIconModule,
        MatButtonModule,
        MatChipsModule,
        MatTooltipModule,
        MatCardModule,
        DatePipe,
        TitleCasePipe,
        PageHeaderComponent,
        MainPageViewComponent,
        AuditFiltersComponent,
    ],
    templateUrl: './audit-list.component.html',
    styleUrls: ['./audit-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuditListComponent implements AfterViewInit {
    private readonly auditService = inject(AuditService);
    readonly auditLogs = this.auditService.auditLogs;

    readonly dataSource = signal<MatTableDataSource<AuditLog>>(new MatTableDataSource<AuditLog>([]));
    readonly displayedColumns: string[] = ['timestamp', 'entity', 'user', 'action', 'severity', 'description', 'restorable', 'actions'];

    readonly sort = viewChild(MatSort);
    readonly paginator = viewChild(MatPaginator);

    readonly filterSearch = signal<string>('');
    readonly filterEntityType = signal<AuditEntityType | ''>('');
    readonly filterAction = signal<AuditActionType | ''>('');
    readonly filterSeverity = signal<AuditSeverity | ''>('');
    readonly filterDateFrom = signal<Date | null>(null);
    readonly filterDateTo = signal<Date | null>(null);

    readonly AUDIT_ENTITY_LABELS = AUDIT_ENTITY_LABELS;
    readonly AUDIT_ACTION_LABELS = AUDIT_ACTION_LABELS;

    ngAfterViewInit() {
        this.updateDataSource();
        const dataSource = this.dataSource();
        const sort = this.sort();
        const paginator = this.paginator();
        if (sort && paginator) {
            dataSource.sort = sort;
            dataSource.paginator = paginator;
            dataSource.filterPredicate = this.filterPredicate;
        }
    }

    private updateDataSource() {
        const dataSource = new MatTableDataSource<AuditLog>(this.auditLogs());
        this.dataSource.set(dataSource);
    }

    private filterPredicate = (data: AuditLog, filter: string): boolean => {
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

    applyFilters() {
        const dataSource = this.dataSource();
        const filterObj = {
            search: this.filterSearch(),
            entityType: this.filterEntityType(),
            action: this.filterAction(),
            severity: this.filterSeverity(),
            dateFrom: this.filterDateFrom(),
            dateTo: this.filterDateTo(),
        };
        dataSource.filter = JSON.stringify(filterObj);
    }

    clearFilters() {
        this.filterSearch.set('');
        this.filterEntityType.set('');
        this.filterAction.set('');
        this.filterSeverity.set('');
        this.filterDateFrom.set(null);
        this.filterDateTo.set(null);
        this.applyFilters();
    }

    onSearchChange(search: string) {
        this.filterSearch.set(search);
        this.applyFilters();
    }

    onEntityTypeChange(entityType: AuditEntityType | '') {
        this.filterEntityType.set(entityType);
        this.applyFilters();
    }

    onActionChange(action: AuditActionType | '') {
        this.filterAction.set(action);
        this.applyFilters();
    }

    onSeverityChange(severity: AuditSeverity | '') {
        this.filterSeverity.set(severity);
        this.applyFilters();
    }

    onDateFromChange(date: Date | null) {
        this.filterDateFrom.set(date);
        this.applyFilters();
    }

    onDateToChange(date: Date | null) {
        this.filterDateTo.set(date);
        this.applyFilters();
    }

    getActionIcon = getAuditActionIcon;
    getActionColor = getActionSeverityColor;
    getActionChipClass = getActionChipClass;
    getEntityTypeIcon = getEntityTypeIcon;

    getEntityLabel(type: AuditEntityType): string {
        return AUDIT_ENTITY_LABELS[type];
    }

    getActionLabel(action: AuditActionType): string {
        return AUDIT_ACTION_LABELS[action];
    }

    restoreLog(logId: string) {
        this.auditService.restoreAuditLog(logId);
    }
}
