import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { KnowledgeArticle } from '../knowledge-base.model';
import { KnowledgeBaseService } from '../knowledge-base.service';
import { LinebreaksPipe } from './line-breaks.pipe';

@Component({
  selector: 'app-article-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatDividerModule,
    LinebreaksPipe
  ],
  templateUrl: './article-detail.component.html',
  styleUrls: ['./article-detail.component.scss']
})
export class ArticleDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly kbService = inject(KnowledgeBaseService);
  readonly article = signal<KnowledgeArticle | undefined>(undefined);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const found = this.kbService.getArticleById(id);
      this.article.set(found);
    }
  }

  onEdit() {
    const a = this.article();
    if (a) {
      console.log('Edytuj artykuł:', a.id);
    }
  }

  onDelete() {
    const a = this.article();
    if (a) {
      console.log('Usuń artykuł:', a.id);
    }
  }

  onHelpful() {
    console.log('Oznaczono jako pomocne');
  }
}