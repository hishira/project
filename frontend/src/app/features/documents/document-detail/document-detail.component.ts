import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MainPageViewComponent } from '../../../core/components/main-page-view/main-page-view.component';
import { PageHeaderComponent } from '../../../core/components/page-header/page-header.component';
import { Document } from '../document.models';
import { DocumentService } from '../document.service';
import { DocumentHeaderComponent } from './document-header/document-header.component';
import { DocumentMetadataItemComponent } from './document-metadata-item/document-metadata-item.component';
import { DocumentDescriptionComponent } from './document-description/document-description.component';
import { DocumentTagsComponent } from './document-tags/document-tags.component';
import { isDocumentExpired, formatFileSize } from '../document.utils';

@Component({
  selector: 'app-document-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatDividerModule,
    MatListModule,
    MatTooltipModule,
    MainPageViewComponent,
    PageHeaderComponent,
    DocumentHeaderComponent,
    DocumentMetadataItemComponent,
    DocumentDescriptionComponent,
    DocumentTagsComponent,
  ],
  templateUrl: './document-detail.component.html',
  styleUrls: ['./document-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly documentService = inject(DocumentService);

  readonly document = signal<Document | undefined>(undefined);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const doc = this.documentService.getDocumentById(id);
      this.document.set(doc);
    }
  }

  downloadFile() {
    const doc = this.document();
    if (doc?.fileUrl) {
      window.open(doc.fileUrl, '_blank');
    }
  }

  protected readonly isDocumentExpired = isDocumentExpired;
  protected readonly formatFileSize = formatFileSize;
}