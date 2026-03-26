import { CommonModule } from '@angular/common';
import { Component, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MainPageViewComponent } from '../../../core/components/main-page-view/main-page-view.component';
import { PageHeaderComponent } from '../../../core/components/page-header/page-header.component';
import { Mention, Sentiment } from '../social.model';
import { SocialService } from '../social.service';
import { SENTIMENT_INFO, PLATFORM_ICONS } from './mention-detail.constants';

interface MentionForm {
  assignedTo: string;
  relatedContactId: string;
  comment: string;
}

@Component({
  selector: 'app-mention-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    MainPageViewComponent,
    PageHeaderComponent,
  ],
  templateUrl: './mention-detail.component.html',
  styleUrls: ['./mention-detail.component.scss']
})
export class MentionDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly socialService = inject(SocialService);

  private readonly mentionId = this.route.snapshot.paramMap.get('id') ?? '';
  
  readonly mention = signal<Mention | undefined>(
    this.mentionId ? this.socialService.getMentionById(this.mentionId) : undefined
  );

  readonly form = signal<MentionForm>({
    assignedTo: this.mention()?.assignedTo ?? '',
    relatedContactId: this.mention()?.relatedContactId ?? '',
    comment: ''
  });

  readonly sentimentInfo = computed(() => {
    const m = this.mention();
    return m ? SENTIMENT_INFO[m.sentiment] : null;
  });

  readonly platformIcon = computed(() => {
    const m = this.mention();
    return m ? (PLATFORM_ICONS[m.platform] ?? 'public') : '';
  });

  readonly isRead = computed(() => this.mention()?.isRead ?? false);
  readonly isFlagged = computed(() => this.mention()?.isFlagged ?? false);
  readonly hasTags = computed(() => {
    const m = this.mention();
    return !!m?.tags && m.tags.length > 0;
  });

  updateForm<K extends keyof MentionForm>(key: K, value: MentionForm[K]) {
    this.form.update(f => ({ ...f, [key]: value }));
  }

  markAsRead(): void {
    const m = this.mention();
    if (m && !m.isRead) {
      this.socialService.markAsRead(m.id);
      this.mention.update(current => current ? { ...current, isRead: true } : current);
    }
  }

  toggleFlag(): void {
    const m = this.mention();
    if (m) {
      this.socialService.flagMention(m.id);
      this.mention.update(current => current ? { ...current, isFlagged: !current.isFlagged } : current);
    }
  }

  assignToUser(): void {
    const m = this.mention();
    const { assignedTo } = this.form();
    if (m && assignedTo) {
      this.socialService.assignToUser(m.id, assignedTo);
    }
  }

  linkToContact(): void {
    const m = this.mention();
    const { relatedContactId } = this.form();
    if (m && relatedContactId) {
      this.socialService.linkToContact(m.id, relatedContactId);
    }
  }

  submitReply(): void {
    const { comment } = this.form();
    if (!comment.trim()) {
      return;
    }
    
    console.log('Reply submitted:', comment);
    this.form.update(f => ({ ...f, comment: '' }));
  }

  protected readonly SENTIMENT_INFO = SENTIMENT_INFO;
  protected readonly PLATFORM_ICONS = PLATFORM_ICONS;
}
