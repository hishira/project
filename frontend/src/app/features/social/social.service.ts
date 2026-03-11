import { Injectable, signal } from '@angular/core';
import { Mention, ScheduledPost, SentimentStats, SocialProfile } from './social.model';

@Injectable({ providedIn: 'root' })
export class SocialService {
    private profilesData: SocialProfile[] = [
        { id: 'prof1', platform: 'facebook', profileId: 'fb123', profileName: 'CRM Soki', profileUrl: 'https://facebook.com/crmsoki', avatarUrl: 'https://example.com/avatar1.png', connected: true, lastSync: new Date() },
        { id: 'prof2', platform: 'twitter', profileId: 'tw456', profileName: '@crmsoki', profileUrl: 'https://twitter.com/crmsoki', connected: true, lastSync: new Date() },
        { id: 'prof3', platform: 'instagram', profileId: 'ig789', profileName: 'crmsoki', profileUrl: 'https://instagram.com/crmsoki', connected: false }
    ];

    private mentionsData: Mention[] = [
        {
            id: 'm1',
            platform: 'twitter',
            type: 'post',
            authorId: 'user1',
            authorName: 'Jan Kowalski',
            authorAvatar: 'https://i.pravatar.cc/40?u=1',
            content: 'Świetne soki od @crmsoki! Polecam wszystkim #soki #zdrowie',
            postedAt: new Date('2025-03-08T14:30:00'),
            url: 'https://twitter.com/user1/status/123',
            sentiment: 'positive',
            sentimentScore: 0.8,
            engagement: { likes: 15, shares: 3, comments: 2 },
            isRead: false,
            isFlagged: false,
            tags: ['produkt'],
            assignedTo: 'u1'
        },
        {
            id: 'm2',
            platform: 'facebook',
            type: 'comment',
            authorId: 'user2',
            authorName: 'Anna Nowak',
            authorAvatar: 'https://i.pravatar.cc/40?u=2',
            content: 'Opakowania są nieszczelne, sok wyciekł. Proszę o kontakt.',
            postedAt: new Date('2025-03-09T09:15:00'),
            url: 'https://facebook.com/permalink',
            sentiment: 'negative',
            sentimentScore: -0.6,
            engagement: { likes: 0, shares: 0, comments: 1 },
            isRead: false,
            isFlagged: true,
            relatedContactId: 'c1',
            assignedTo: 'u2'
        },
        {
            id: 'm3',
            platform: 'instagram',
            type: 'post',
            authorId: 'user3',
            authorName: 'Piotr Wiśniewski',
            authorAvatar: 'https://i.pravatar.cc/40?u=3',
            content: 'Nowa dostawa soków od CRM – pyszne!',
            postedAt: new Date('2025-03-07T18:45:00'),
            url: 'https://instagram.com/p/xyz',
            sentiment: 'positive',
            sentimentScore: 0.9,
            engagement: { likes: 45, shares: 2, comments: 5 },
            isRead: true,
            isFlagged: false
        },
        {
            id: 'm4',
            platform: 'twitter',
            type: 'post',
            authorId: 'user4',
            authorName: 'Magdalena Zając',
            content: 'Czekam na dostawę już tydzień...',
            postedAt: new Date('2025-03-10T08:00:00'),
            url: 'https://twitter.com/user4/status/456',
            sentiment: 'negative',
            sentimentScore: -0.4,
            engagement: { likes: 2, shares: 0, comments: 0 },
            isRead: false,
            isFlagged: false,
            assignedTo: 'u3'
        },
        {
            id: 'm5',
            platform: 'linkedin',
            type: 'comment',
            authorId: 'user5',
            authorName: 'Tomasz Nowicki',
            content: 'Ciekawy artykuł o sokach ekologicznych.',
            postedAt: new Date('2025-03-06T11:20:00'),
            url: 'https://linkedin.com/feed/',
            sentiment: 'neutral',
            sentimentScore: 0.1,
            engagement: { likes: 8, shares: 1, comments: 0 },
            isRead: true,
            isFlagged: false
        }
    ];

    private scheduledPostsData: ScheduledPost[] = [
        { id: 'sp1', platform: 'facebook', content: 'Nowość! Soki z marchwi już w sprzedaży.', scheduledAt: new Date('2025-03-12T10:00:00'), status: 'scheduled', createdBy: 'Jan Kowalski', createdAt: new Date() },
        { id: 'sp2', platform: 'twitter', content: 'Konkurs: wygraj roczny zapas soków!', scheduledAt: new Date('2025-03-15T12:00:00'), status: 'draft', createdBy: 'Anna Nowak', createdAt: new Date() }
    ];

    readonly profiles = signal<SocialProfile[]>(this.profilesData);
    readonly mentions = signal<Mention[]>(this.mentionsData);
    readonly scheduledPosts = signal<ScheduledPost[]>(this.scheduledPostsData);

    getMentionById(id: string): Mention | undefined {
        return this.mentions().find(m => m.id === id);
    }

    getMentionsByPlatform(platform: string): Mention[] {
        return this.mentions().filter(m => m.platform === platform);
    }

    getMentionsBySentiment(sentiment: string): Mention[] {
        return this.mentions().filter(m => m.sentiment === sentiment);
    }

    getSentimentStats(): SentimentStats {
        const mentions = this.mentions();
        const positive = mentions.filter(m => m.sentiment === 'positive').length;
        const neutral = mentions.filter(m => m.sentiment === 'neutral').length;
        const negative = mentions.filter(m => m.sentiment === 'negative').length;
        const total = mentions.length;
        return {
            positive, neutral, negative, total,
            trend: 'stable',
            period: 'week'
        };
    }

    // Symulacje akcji
    markAsRead(id: string) {
        console.log('Oznacz jako przeczytane:', id);
    }

    flagMention(id: string) {
        console.log('Oflaguj wzmiankę:', id);
    }

    assignToUser(id: string, userId: string) {
        console.log('Przypisz wzmiankę do użytkownika:', id, userId);
    }

    linkToContact(id: string, contactId: string) {
        console.log('Powiąż z kontaktem:', id, contactId);
    }

    publishPost(post: Omit<ScheduledPost, 'id' | 'createdAt'>) {
        console.log('Publikuj post:', post);
    }
}