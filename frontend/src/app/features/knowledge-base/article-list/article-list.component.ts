import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { KnowledgeBaseService } from '../knowledge-base.service';
import { KnowledgeArticle, ArticleCategory } from '../knowledge-base.model';

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
    private kbService = inject(KnowledgeBaseService);
    articles = this.kbService.articles;

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