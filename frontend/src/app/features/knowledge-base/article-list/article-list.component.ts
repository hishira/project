import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { ArticleCategory, KnowledgeArticle } from '../knowledge-base.model';
import { KnowledgeBaseService } from '../knowledge-base.service';

@Component({
    selector: 'app-article-list',
    standalone: true,
    imports: [
        CommonModule,
        RouterLink,
        MatTabsModule,
        MatCardModule,
        MatIconModule,
        MatButtonModule,
        MatChipsModule,
        MatTooltipModule
    ],
    templateUrl: './article-list.component.html',
    styleUrls: ['./article-list.component.scss']
})
export class ArticleListComponent {
    private readonly kbService = inject(KnowledgeBaseService);
    readonly articles = this.kbService.articles;

    // Kategorie do zakładek
    categories: { value: ArticleCategory; label: string }[] = [
        { value: 'faq', label: 'FAQ' },
        { value: 'instruction', label: 'Instrukcje' },
        { value: 'guide', label: 'Poradniki' }
    ];

    activeCategory: ArticleCategory = 'faq';

    get filteredArticles(): KnowledgeArticle[] {
        return this.articles().filter(a => a.category === this.activeCategory);
    }

    get selectedTabIndex(): number {
        const index = this.categories.findIndex(c => c.value === this.activeCategory);
        return index >= 0 ? index : 0; // domyślnie pierwsza zakładka
    }

    // Symulacja dodawania
    onAdd() {
        console.log('Dodaj nowy artykuł w kategorii:', this.activeCategory);
    }

    // Symulacja edycji
    onEdit(article: KnowledgeArticle, event: MouseEvent) {
        event.stopPropagation();
        console.log('Edytuj artykuł:', article.id);
    }

    // Symulacja usunięcia
    onDelete(article: KnowledgeArticle, event: MouseEvent) {
        event.stopPropagation();
        console.log('Usuń artykuł:', article.id);
    }
}