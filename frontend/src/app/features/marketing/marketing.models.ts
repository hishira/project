export type CampaignStatus = 'draft' | 'scheduled' | 'active' | 'paused' | 'completed' | 'archived';
export type CampaignType = 'email' | 'sms' | 'social' | 'push';

export interface Campaign {
  id: string;
  name: string;
  type: CampaignType;
  status: CampaignStatus;
  subject?: string;      // dla email
  content?: string;      // treść
  scheduledAt?: Date;
  sentAt?: Date;
  stats: {
    recipients: number;
    opened: number;
    clicked: number;
    bounced: number;
    unsubscribed: number;
  };
  segmentId?: string;    // docelowy segment
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Segment {
  id: string;
  name: string;
  description: string;
  criteria: Record<string, any>; // uproszczone
  contactsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface MessageTemplate {
  id: string;
  name: string;
  type: CampaignType;
  subject?: string;      // dla email
  content: string;       // treść (HTML lub tekst)
  createdAt: Date;
  updatedAt: Date;
}

// Podsumowanie dla dashboardu
export interface MarketingSummary {
  totalCampaigns: number;
  activeCampaigns: number;
  totalRecipients: number;
  averageOpenRate: number;   // %
  averageClickRate: number;  // %
  segmentsCount: number;
  templatesCount: number;
  recentCampaigns: Campaign[];
  topPerforming: Campaign[];
}