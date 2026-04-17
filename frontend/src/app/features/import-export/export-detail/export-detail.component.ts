import { Component, OnInit, inject, signal, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ChangeDetectionStrategy } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PageHeaderComponent } from '../../../core/components/page-header/page-header.component';
import { MainPageViewComponent } from '../../../core/components/main-page-view/main-page-view.component';
import { ImportExportService } from '../import-export.service';
import { ExportJob } from '../import-export.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-export-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, MatCardModule, MatButtonModule, MatIconModule, PageHeaderComponent, MainPageViewComponent],
  templateUrl: './export-detail.component.html',
  styleUrls: ['./export-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExportDetailComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private readonly service = inject(ImportExportService);
  private subscription?: Subscription;

  exportJob = signal<ExportJob | undefined>(undefined);

  ngOnInit(): void {
    this.subscription = this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.exportJob.set(this.service.getExportJobById(id));
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
