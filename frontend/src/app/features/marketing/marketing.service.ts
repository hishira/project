import { Injectable, signal } from '@angular/core';
import { Campaign, Segment, MessageTemplate, MarketingSummary } from './marketing.models';

@Injectable({ providedIn: 'root' })
export class MarketingService {
  // Przykładowe kampanie
  private campaignsData: Campaign[] = [
    {
      id: 'cmp1',
      name: 'Wiosenna promocja',
      type: 'email',
      status: 'completed',
      subject: 'Rabaty na wiosnę!',
      content: 'Treść kampanii wiosennej...',
      sentAt: new Date('2025-03-01T10:00:00'),
      stats: {
        recipients: 12500,
        opened: 4850,
        clicked: 2100,
        bounced: 120,
        unsubscribed: 45
      },
      segmentId: 'seg1',
      createdBy: 'Jan Kowalski',
      createdAt: new Date('2025-02-15T09:00:00'),
      updatedAt: new Date('2025-03-01T10:00:00')
    },
    {
      id: 'cmp2',
      name: 'Webinar o CRM',
      type: 'email',
      status: 'active',
      subject: 'Dołącz do webinaru',
      content: 'Treść zaproszenia...',
      scheduledAt: new Date('2025-04-10T15:00:00'),
      stats: {
        recipients: 3200,
        opened: 1540,
        clicked: 890,
        bounced: 25,
        unsubscribed: 12
      },
      segmentId: 'seg2',
      createdBy: 'Anna Nowak',
      createdAt: new Date('2025-03-20T11:30:00'),
      updatedAt: new Date('2025-03-25T14:20:00')
    },
    {
      id: 'cmp3',
      name: 'Powiadomienie o nowej funkcji',
      type: 'push',
      status: 'scheduled',
      content: 'Nowa wersja dostępna!',
      scheduledAt: new Date('2025-04-15T08:00:00'),
      stats: {
        recipients: 5000,
        opened: 0,
        clicked: 0,
        bounced: 0,
        unsubscribed: 0
      },
      segmentId: 'seg3',
      createdBy: 'Piotr Wiśniewski',
      createdAt: new Date('2025-03-28T16:00:00'),
      updatedAt: new Date('2025-03-28T16:00:00')
    },
    {
      id: 'cmp4',
      name: 'Ankieta satysfakcji',
      type: 'email',
      status: 'draft',
      subject: 'Podziel się opinią',
      content: 'Treść ankiety...',
      stats: {
        recipients: 0,
        opened: 0,
        clicked: 0,
        bounced: 0,
        unsubscribed: 0
      },
      createdBy: 'Magdalena Zając',
      createdAt: new Date('2025-03-29T09:15:00'),
      updatedAt: new Date('2025-03-29T09:15:00')
    },
    {
      id: 'cmp5',
      name: 'Promocja na social media',
      type: 'social',
      status: 'paused',
      content: 'Post promocyjny...',
      stats: {
        recipients: 8500,
        opened: 3200,
        clicked: 1100,
        bounced: 0,
        unsubscribed: 0
      },
      segmentId: 'seg1',
      createdBy: 'Jan Kowalski',
      createdAt: new Date('2025-03-10T13:45:00'),
      updatedAt: new Date('2025-03-18T10:30:00')
    }
  ];

  // Przykładowe segmenty
  private segmentsData: Segment[] = [
    {
      id: 'seg1',
      name: 'Klienci aktywni',
      description: 'Klienci, którzy dokonali zakupu w ostatnich 30 dniach',
      criteria: { lastPurchase: '<=30 days' },
      contactsCount: 12500,
      createdAt: new Date('2025-01-10T08:00:00'),
      updatedAt: new Date('2025-03-15T11:20:00')
    },
    {
      id: 'seg2',
      name: 'Leady zainteresowane webinarami',
      description: 'Osoby, które kliknęły w link do webinaru',
      criteria: { event: 'webinar_click' },
      contactsCount: 3200,
      createdAt: new Date('2025-02-05T10:30:00'),
      updatedAt: new Date('2025-03-20T14:00:00')
    },
    {
      id: 'seg3',
      name: 'Użytkownicy aplikacji mobilnej',
      description: 'Klienci korzystający z aplikacji w ostatnim tygodniu',
      criteria: { appUsage: '>=1 time last 7 days' },
      contactsCount: 5000,
      createdAt: new Date('2025-01-22T09:00:00'),
      updatedAt: new Date('2025-03-10T16:45:00')
    },
    {
      id: 'seg4',
      name: 'Newsletter subskrybenci',
      description: 'Osoby zapisane do newslettera',
      criteria: { subscribed: true },
      contactsCount: 28700,
      createdAt: new Date('2024-12-01T12:00:00'),
      updatedAt: new Date('2025-03-28T13:15:00')
    }
  ];

  // Przykładowe szablony
  private templatesData: MessageTemplate[] = [
    {
      id: 'tpl1',
      name: 'Powitalny',
      type: 'email',
      subject: 'Witaj w naszym systemie!',
      content: '<h1>Dziękujemy za rejestrację</h1><p>...</p>',
      createdAt: new Date('2024-11-10T09:00:00'),
      updatedAt: new Date('2025-01-15T11:30:00')
    },
    {
      id: 'tpl2',
      name: 'Przypomnienie o wydarzeniu',
      type: 'email',
      subject: 'Już jutro webinar!',
      content: '<p>Przypominamy...</p>',
      createdAt: new Date('2025-02-20T14:20:00'),
      updatedAt: new Date('2025-03-01T10:00:00')
    },
    {
      id: 'tpl3',
      name: 'Powiadomienie push',
      type: 'push',
      content: 'Masz nową wiadomość',
      createdAt: new Date('2025-03-05T08:30:00'),
      updatedAt: new Date('2025-03-05T08:30:00')
    },
    {
      id: 'tpl4',
      name: 'SMS z kodem rabatowym',
      type: 'sms',
      content: 'Twój kod rabatowy: SAVE20',
      createdAt: new Date('2025-03-18T16:00:00'),
      updatedAt: new Date('2025-03-18T16:00:00')
    }
  ];

  // Sygnały przechowujące dane
  readonly campaigns = signal<Campaign[]>(this.campaignsData);
  readonly segments = signal<Segment[]>(this.segmentsData);
  readonly templates = signal<MessageTemplate[]>(this.templatesData);

  // Metoda do pobrania podsumowania marketingowego
  getMarketingSummary(): MarketingSummary {
    const campaigns = this.campaigns();
    const activeCampaigns = campaigns.filter(c => c.status === 'active').length;
    const totalRecipients = campaigns.reduce((acc, c) => acc + c.stats.recipients, 0);
    const totalOpened = campaigns.reduce((acc, c) => acc + c.stats.opened, 0);
    const totalClicked = campaigns.reduce((acc, c) => acc + c.stats.clicked, 0);
    const avgOpenRate = totalRecipients ? (totalOpened / totalRecipients) * 100 : 0;
    const avgClickRate = totalOpened ? (totalClicked / totalOpened) * 100 : 0;

    const recentCampaigns = [...campaigns]
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 3);

    const topPerforming = [...campaigns]
      .filter(c => c.stats.recipients > 0)
      .sort((a, b) => (b.stats.opened / b.stats.recipients) - (a.stats.opened / a.stats.recipients))
      .slice(0, 3);

    return {
      totalCampaigns: campaigns.length,
      activeCampaigns,
      totalRecipients,
      averageOpenRate: Math.round(avgOpenRate * 10) / 10,
      averageClickRate: Math.round(avgClickRate * 10) / 10,
      segmentsCount: this.segments().length,
      templatesCount: this.templates().length,
      recentCampaigns,
      topPerforming
    };
  }
}