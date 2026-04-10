import { CommonModule, DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { ArticleCategory, KnowledgeArticle } from '../knowledge-base.model';
import { KnowledgeBaseService } from '../knowledge-base.service';
import { MainPageViewComponent } from '../../../core/components/main-page-view/main-page-view.component';
import { PageHeaderComponent } from '../../../core/components/page-header/page-header.component';

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
        MatTooltipModule,
        DatePipe,
        MainPageViewComponent,
        PageHeaderComponent,
    ],
    templateUrl: './article-list.component.html',
    styleUrls: ['./article-list.component.scss']
})
export class ArticleListComponent {
    private readonly kbService = inject(KnowledgeBaseService);
    readonly articles = this.kbService.articles;

    readonly categories: { value: ArticleCategory; label: string }[] = [
        { value: 'faq', label: 'FAQ' },
        { value: 'instruction', label: 'Instrukcje' },
        { value: 'guide', label: 'Poradniki' }
    ];

    readonly activeCategory = signal<ArticleCategory>('faq');

    readonly filteredArticles = computed(() => {
        const category = this.activeCategory();
        return this.articles().filter(a => a.category === category);
    });

    readonly selectedTabIndex = computed(() => {
        const category = this.activeCategory();
        const index = this.categories.findIndex(c => c.value === category);
        return index >= 0 ? index : 0;
    });

    onCategoryChange(event: any) {
        const index = event.index;
        if (index >= 0 && index < this.categories.length) {
            this.activeCategory.set(this.categories[index].value);
        }
    }
}