import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { SocialService } from '../social.service';
import { Mention, Sentiment } from '../social.model';

@Component({
  selector: 'app-mention-detail',
  standalone: true,
  imports: [
    CommonModule, RouterLink,
    MatCardModule, MatIconModule, MatButtonModule, MatChipsModule,
    MatDividerModule, MatFormFieldModule, MatInputModule, MatSelectModule,
    FormsModule
  ],
  templateUrl: './mention-detail.component.html',
  styleUrls: ['./mention-detail.component.scss']
})
export class MentionDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private socialService = inject(SocialService);
  mention = signal<Mention | undefined>(undefined);

  // Do edycji
  assignedTo = '';
  relatedContactId = '';
  comment = '';

  sentiments: { value: Sentiment; label: string; icon: string; color: string }[] = [
    { value: 'positive', label: 'Pozytywny', icon: 'sentiment_satisfied', color: '#2e7d32' },
    { value: 'neutral', label: 'Neutralny', icon: 'sentiment_neutral', color: '#757575' },
    { value: 'negative', label: 'Negatywny', icon: 'sentiment_dissatisfied', color: '#d32f2f' }
  ];

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const found = this.socialService.getMentionById(id);
      this.mention.set(found);
      if (found) {
        this.assignedTo = found.assignedTo || '';
        this.relatedContactId = found.relatedContactId || '';
      }
    }
  }

  getPlatformIcon(platform: string): string {
    const icons: Record<string, string> = {
      facebook: 'facebook',
      twitter: 'twitter',
      instagram: 'instagram',
      linkedin: 'linkedin',
      youtube: 'youtube',
      other: 'share'
    };
    return icons[platform] || 'public';
  }

  getSentimentData(sentiment: Sentiment) {
    return this.sentiments.find(s => s.value === sentiment) || this.sentiments[1];
  }

  onMarkRead() {
    const m = this.mention();
    if (m && !m.isRead) {
      this.socialService.markAsRead(m.id);
      this.mention.update(m => m ? { ...m, isRead: true } : m);
    }
  }

  onFlag() {
    const m = this.mention();
    if (m) {
      this.socialService.flagMention(m.id);
      this.mention.update(m => m ? { ...m, isFlagged: !m.isFlagged } : m);
    }
  }

  onAssign() {
    const m = this.mention();
    if (m && this.assignedTo) {
      this.socialService.assignToUser(m.id, this.assignedTo);
    }
  }

  onLinkContact() {
    const m = this.mention();
    if (m && this.relatedContactId) {
      this.socialService.linkToContact(m.id, this.relatedContactId);
    }
  }

  onReply() {
    console.log('Odpowiedz na wzmiankę:', this.comment);
  }
}