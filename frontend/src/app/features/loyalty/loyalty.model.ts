export type MembershipLevel = 'bronze' | 'silver' | 'gold' | 'platinum';

export interface LevelColorConfig {
  [key: string]: string;
}

export interface LevelIconConfig {
  [key: string]: string;
}

export interface LoyaltyProgram {
  id: string;
  name: string;
  pointsPerCurrency: number; // np. 1 punkt za każde 10 PLN
  levels: Level[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Level {
  name: MembershipLevel;
  threshold: number; // minimalna liczba punktów do osiągnięcia
  discount: number; // rabat procentowy
  benefits: string[];
}

export interface CustomerLoyalty {
  customerId: string;
  customerName: string;
  customerEmail: string;
  points: number;
  lifetimePoints: number; // punkty zdobyte łącznie (nie wydane)
  level: MembershipLevel;
  nextLevelThreshold?: number; // punkty potrzebne do następnego poziomu
  pointsToNextLevel?: number;
  transactions: PointsTransaction[];
  rewards: Reward[];
}

export interface PointsTransaction {
  id: string;
  date: Date;
  description: string;
  pointsChange: number; // dodatnie (przyznanie) lub ujemne (wydanie)
  balanceAfter: number;
  source: 'purchase' | 'bonus' | 'reward' | 'adjustment';
  relatedInvoiceId?: string;
}

export interface Reward {
  id: string;
  name: string;
  description: string;
  pointsCost: number;
  discount?: number; // wartość rabatu (np. 20 PLN)
  discountType?: 'percentage' | 'fixed';
  code?: string; // kod rabatowy (jeśli przyznany)
  expiresAt?: Date;
  redeemedAt?: Date;
}