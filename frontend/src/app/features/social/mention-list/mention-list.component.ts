import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { MainPageViewComponent } from '../../../core/components/main-page-view/main-page-view.component';
import { PageHeaderComponent } from '../../../core/components/page-header/page-header.component';
import { PlatformIconComponent } from '../../../shared/components/platform-icon/platform-icon.component';
import { SentimentIconComponent } from '../../../shared/components/sentiment-icon/sentiment-icon.component';
import { Sentiment, SocialPlatform } from '../social.model';
import { SocialService } from '../social.service';
import { DISPLAYED_COLUMNS, PLATFORMS, SENTIMENTS } from './mention-list.constants';

interface MentionFilters {
  platform: SocialPlatform | '';
  sentiment: Sentiment | '';
  author: string;
}

@Component({
  selector: 'app-mention-list',
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
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    MatCardModule,
    MainPageViewComponent,
    PageHeaderComponent,
    PlatformIconComponent,
    SentimentIconComponent,
  ],
  templateUrl: './mention-list.component.html',
  styleUrls: ['./mention-list.component.scss']
})
export class MentionListComponent {
  private socialService = inject(SocialService);

  readonly filters = signal<MentionFilters>({
    platform: '',
    sentiment: '',
    author: ''
  });

  readonly filteredMentions = computed(() => {
    const { platform, sentiment, author } = this.filters();
    return this.socialService.mentions().filter(mention => {
      if (platform && mention.platform !== platform) return false;
      if (sentiment && mention.sentiment !== sentiment) return false;
      if (author && !mention.authorName.toLowerCase().includes(author.toLowerCase())) return false;
      return true;
    });
  });

  readonly displayedColumns = DISPLAYED_COLUMNS;
  readonly platforms = PLATFORMS;
  readonly sentiments = SENTIMENTS;

  readonly sort = viewChild(MatSort);
  readonly paginator = viewChild(MatPaginator);

  updateFilter<K extends keyof MentionFilters>(key: K, value: MentionFilters[K]) {
    this.filters.update(f => ({ ...f, [key]: value }));
  }

  clearFilters() {
    this.filters.set({ platform: '', sentiment: '', author: '' });
  }
}
