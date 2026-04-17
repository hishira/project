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
import { AuditFilterService } from '../audit-filter.service';
import { AuditFiltersComponent } from '../audit-filters/audit-filters.component';
import { AuditTimestampCellComponent } from './cells/audit-timestamp-cell/audit-timestamp-cell.component';
import { AuditEntityCellComponent } from './cells/audit-entity-cell/audit-entity-cell.component';
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
        AuditTimestampCellComponent,
        AuditEntityCellComponent,
    ],
    templateUrl: './audit-list.component.html',
    styleUrls: ['./audit-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuditListComponent implements AfterViewInit {
    readonly auditService = inject(AuditService);
    readonly filterService = inject(AuditFilterService);
    readonly auditLogs = this.auditService.auditLogs;

    readonly dataSource = signal<MatTableDataSource<AuditLog>>(new MatTableDataSource<AuditLog>([]));
    readonly displayedColumns: string[] = ['timestamp', 'entity', 'user', 'action', 'severity', 'description', 'restorable', 'actions'];

    readonly sort = viewChild(MatSort);
    readonly paginator = viewChild(MatPaginator);

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
            dataSource.filterPredicate = this.filterService.filterPredicate;
        }
    }

    private updateDataSource() {
        const dataSource = new MatTableDataSource<AuditLog>(this.auditLogs());
        this.dataSource.set(dataSource);
    }

    applyFilters() {
        const dataSource = this.dataSource();
        dataSource.filter = this.filterService.getFilterString();
    }

    clearFilters() {
        this.filterService.clearFilters();
        this.applyFilters();
    }

    onSearchChange(search: string) {
        this.filterService.filterSearch.set(search);
        this.applyFilters();
    }

    onEntityTypeChange(entityType: AuditEntityType | '') {
        this.filterService.filterEntityType.set(entityType);
        this.applyFilters();
    }

    onActionChange(action: AuditActionType | '') {
        this.filterService.filterAction.set(action);
        this.applyFilters();
    }

    onSeverityChange(severity: AuditSeverity | '') {
        this.filterService.filterSeverity.set(severity);
        this.applyFilters();
    }

    onDateFromChange(date: Date | null) {
        this.filterService.filterDateFrom.set(date);
        this.applyFilters();
    }

    onDateToChange(date: Date | null) {
        this.filterService.filterDateTo.set(date);
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
