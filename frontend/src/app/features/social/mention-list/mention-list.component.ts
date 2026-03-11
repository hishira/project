import { Component, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { SocialService } from '../social.service';
import { Mention, Sentiment, SocialPlatform } from '../social.model';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-mention-list',
  standalone: true,
  imports: [
    CommonModule, RouterLink,
    MatTableModule, MatSortModule, MatPaginatorModule,
    MatIconModule, MatButtonModule, MatChipsModule, MatTooltipModule,
    MatFormFieldModule, MatInputModule, MatSelectModule, FormsModule, MatCardModule
  ],
  templateUrl: './mention-list.component.html',
  styleUrls: ['./mention-list.component.scss']
})
export class MentionListComponent {
  private socialService = inject(SocialService);
  mentions = this.socialService.mentions;

  dataSource = new MatTableDataSource<Mention>(this.mentions());
  displayedColumns: string[] = ['platform', 'author', 'content', 'sentiment', 'engagement', 'postedAt', 'actions'];

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  filterPlatform: SocialPlatform | '' = '';
  filterSentiment: Sentiment | '' = '';
  filterAuthor = '';

  platforms: { value: SocialPlatform; label: string }[] = [
    { value: 'facebook', label: 'Facebook' },
    { value: 'twitter', label: 'Twitter' },
    { value: 'instagram', label: 'Instagram' },
    { value: 'linkedin', label: 'LinkedIn' },
    { value: 'youtube', label: 'YouTube' },
    { value: 'other', label: 'Inne' }
  ];

  sentiments: { value: Sentiment; label: string }[] = [
    { value: 'positive', label: 'Pozytywny' },
    { value: 'neutral', label: 'Neutralny' },
    { value: 'negative', label: 'Negatywny' }
  ];

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.dataSource.filterPredicate = (data: Mention, filter: string) => {
      const filterObj = JSON.parse(filter);
      if (filterObj.platform && data.platform !== filterObj.platform) return false;
      if (filterObj.sentiment && data.sentiment !== filterObj.sentiment) return false;
      if (filterObj.author && !data.authorName.toLowerCase().includes(filterObj.author.toLowerCase())) return false;
      return true;
    };
  }

  applyFilters() {
    const filterObj = {
      platform: this.filterPlatform,
      sentiment: this.filterSentiment,
      author: this.filterAuthor
    };
    this.dataSource.filter = JSON.stringify(filterObj);
  }

  clearFilters() {
    this.filterPlatform = '';
    this.filterSentiment = '';
    this.filterAuthor = '';
    this.applyFilters();
  }

  getPlatformIcon(platform: SocialPlatform): string {
    const icons: Record<SocialPlatform, string> = {
      facebook: 'facebook',
      twitter: 'twitter',
      instagram: 'instagram',
      linkedin: 'linkedin',
      youtube: 'youtube',
      other: 'share'
    };
    return icons[platform] || 'public';
  }

  getSentimentIcon(sentiment: Sentiment): string {
    const icons: Record<Sentiment, string> = {
      positive: 'sentiment_satisfied',
      neutral: 'sentiment_neutral',
      negative: 'sentiment_dissatisfied'
    };
    return icons[sentiment];
  }

  getSentimentColor(sentiment: Sentiment): string {
    const colors: Record<Sentiment, string> = {
      positive: '#2e7d32',
      neutral: '#757575',
      negative: '#d32f2f'
    };
    return colors[sentiment];
  }
}