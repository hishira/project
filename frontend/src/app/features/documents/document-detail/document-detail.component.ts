import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Document } from '../document.models';
import { DocumentService } from '../document.service';

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
    MatTooltipModule
  ],
  templateUrl: './document-detail.component.html',
  styleUrls: ['./document-detail.component.scss']
})
export class DocumentDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private documentService = inject(DocumentService);
  document = signal<Document | undefined>(undefined);
  readonly now = Date.now();
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const doc = this.documentService.getDocumentById(id);
      this.document.set(doc);
    }
  }

  isExpired(document: any): boolean {
    return document.expiryDate < (this.now)
  }
  getTypeIcon(type: string): string {
    const icons: Record<string, string> = {
      contract: 'description',
      annex: 'note_add',
      specification: 'science',
      protocol: 'assignment',
      other: 'insert_drive_file'
    };
    return icons[type] || 'description';
  }

  getTypeLabel(type: string): string {
    const labels: Record<string, string> = {
      contract: 'Umowa',
      annex: 'Aneks',
      specification: 'Specyfikacja',
      protocol: 'Protokół',
      other: 'Inny'
    };
    return labels[type];
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  downloadFile() {
    const doc = this.document();
    if (doc?.fileUrl) {
      // W praktyce można otworzyć w nowej karcie lub zasymulować pobieranie
      window.open(doc.fileUrl, '_blank');
    }
  }
}