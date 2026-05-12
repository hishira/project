import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import { MainPageViewComponent } from '../../../core/components/main-page-view/main-page-view.component';
import { PageHeaderComponent } from '../../../core/components/page-header/page-header.component';
import { ModalService } from '../../../core/services/modal.service';
import { ExportConfigDialogComponent } from '../export-config-dialog/export-config-dialog.component';
import { ExportJob } from '../import-export.model';
import { ImportExportService } from '../import-export.service';

@Component({
  selector: 'app-export-list',
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatTableModule,
    MatTooltipModule,
    MatDialogModule,
    MatChipsModule,
    PageHeaderComponent,
    MainPageViewComponent,
  ],
  providers: [ModalService],
  templateUrl: './export-list.component.html',
  styleUrls: ['./export-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExportListComponent {
  private readonly service = inject(ImportExportService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly modalService = inject(ModalService);

  readonly exportJobs = this.service.exportJobs;
  readonly selectedJob = signal<ExportJob | null>(null);

  openExportModal() {
    const dialogRef = this.modalService.open(ExportConfigDialogComponent, {
      data: { entities: this.service.getExportEntities() },
      width: '620px',
    });

    dialogRef.afterClosed().subscribe((config) => {
      if (config) {
        const newJob = this.service.createExportJob(config);
        this.router.navigate(['/import-export/details', newJob.id]);
      }
    });
  }

  viewDetails(job: ExportJob) {
    this.router.navigate(['/import-export/details', job.id]);
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'ready':
        return 'check_circle';
      case 'scheduled':
        return 'schedule';
      case 'failed':
        return 'error';
      default:
        return 'help';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'ready':
        return 'Gotowy';
      case 'scheduled':
        return 'Zaplanowany';
      case 'failed':
        return 'Błąd';
      default:
        return status;
    }
  }
}
