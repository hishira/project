import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MainPageViewComponent } from '../../../core/components/main-page-view/main-page-view.component';
import { PageHeaderComponent } from '../../../core/components/page-header/page-header.component';
import { ImportExportService } from '../import-export.service';

@Component({
  selector: 'app-export-detail',
  imports: [CommonModule, RouterLink, MatCardModule, MatButtonModule, MatIconModule, MatChipsModule, MatDividerModule, PageHeaderComponent, MainPageViewComponent],
  templateUrl: './export-detail.component.html',
  styleUrls: ['./export-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExportDetailComponent {
  private route = inject(ActivatedRoute);
  private readonly service = inject(ImportExportService);

  private routeParams = toSignal(this.route.paramMap);

  exportJob = computed(() => {
    const params = this.routeParams();
    const id = params?.get('id');
    return id ? this.service.getExportJobById(id) : undefined;
  });

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
