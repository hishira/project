import { Injectable, signal } from '@angular/core';
import { ClientOnboarding, OnboardingListItem, TrainingMaterial, Webinar, OnboardingTask } from './onboarding.model';

@Injectable({ providedIn: 'root' })
export class OnboardingService {
  private onboardingsData: ClientOnboarding[] = [
    {
      id: 'onb1',
      clientId: 'c1',
      clientName: 'Tymbark Sp. z o.o.',
      startDate: new Date('2025-03-01'),
      endDate: new Date('2025-04-01'),
      status: 'in_progress',
      tasks: [
        { id: 't1', title: 'Wypełnij formularz kontaktowy', description: 'Podaj dane osoby odpowiedzialnej', status: 'completed', order: 1, completedAt: new Date('2025-03-02') },
        { id: 't2', title: 'Prześlij listę preferowanych produktów', status: 'pending', order: 2, dueDays: 7 },
        { id: 't3', title: 'Umów pierwsze spotkanie', status: 'pending', order: 3 }
      ],
      materials: [
        { id: 'm1', title: 'Instrukcja obsługi portalu', type: 'article', url: '/assets/docs/portal.pdf', required: true, viewedByClient: true, viewedAt: new Date('2025-03-03') },
        { id: 'm2', title: 'Film: Jak składać zamówienia', type: 'video', url: 'https://youtu.be/abc123', duration: 5, required: true, viewedByClient: false },
        { id: 'm3', title: 'Prezentacja oferty', type: 'presentation', url: '/assets/docs/offer.pdf', required: false, viewedByClient: false }
      ],
      webinars: [
        { id: 'w1', title: 'Webinar wprowadzający', description: 'Omówienie podstaw', scheduledAt: new Date('2025-03-10T10:00:00'), duration: 60, host: 'Jan Kowalski', registered: true, attended: false },
        { id: 'w2', title: 'Zaawansowane funkcje', description: 'Dla zaawansowanych', scheduledAt: new Date('2025-03-20T14:00:00'), duration: 90, host: 'Anna Nowak', registered: false }
      ],
      progress: 30,
      createdAt: new Date('2025-03-01'),
      updatedAt: new Date('2025-03-05')
    },
    {
      id: 'onb2',
      clientId: 'c2',
      clientName: 'Capri-Sun Polska',
      startDate: new Date('2025-02-15'),
      endDate: new Date('2025-03-15'),
      status: 'completed',
      tasks: [
        { id: 't4', title: 'Wypełnij formularz', status: 'completed', order: 1, completedAt: new Date('2025-02-16') },
        { id: 't5', title: 'Odbierz login', status: 'completed', order: 2, completedAt: new Date('2025-02-18') }
      ],
      materials: [
        { id: 'm4', title: 'Instrukcja', type: 'article', url: '/assets/docs/instrukcja.pdf', required: true, viewedByClient: true }
      ],
      webinars: [],
      progress: 100,
      createdAt: new Date('2025-02-15'),
      updatedAt: new Date('2025-03-10')
    },
    {
      id: 'onb3',
      clientId: 'c3',
      clientName: 'PepsiCo Polska',
      startDate: new Date('2025-03-05'),
      endDate: new Date('2025-04-05'),
      status: 'in_progress',
      tasks: [
        { id: 't6', title: 'Wypełnij formularz', status: 'completed', order: 1, completedAt: new Date('2025-03-06') },
        { id: 't7', title: 'Zapoznaj się z umową', status: 'completed', order: 2, completedAt: new Date('2025-03-07') },
        { id: 't8', title: 'Prześlij dane do faktury', status: 'pending', order: 3 }
      ],
      materials: [
        { id: 'm5', title: 'Film szkoleniowy', type: 'video', url: 'https://youtu.be/def456', duration: 10, required: true, viewedByClient: true },
        { id: 'm6', title: 'Prezentacja', type: 'presentation', url: '/assets/docs/prezentacja.pdf', required: true, viewedByClient: false }
      ],
      webinars: [
        { id: 'w3', title: 'Szkolenie live', description: 'Praktyczne demo', scheduledAt: new Date('2025-03-25T11:00:00'), duration: 120, host: 'Piotr Wiśniewski', registered: true, attended: false }
      ],
      progress: 60,
      createdAt: new Date('2025-03-05'),
      updatedAt: new Date('2025-03-08')
    }
  ];

  readonly onboardings = signal<ClientOnboarding[]>(this.onboardingsData);

  getOnboardingById(id: string): ClientOnboarding | undefined {
    return this.onboardings().find(o => o.id === id);
  }

  getOnboardingList(): OnboardingListItem[] {
    return this.onboardings().map(o => ({
      id: o.id,
      clientName: o.clientName,
      startDate: o.startDate,
      progress: o.progress,
      status: o.status
    }));
  }

  // Symulacje akcji
  markTaskAsCompleted(onboardingId: string, taskId: string) {
    console.log('Oznacz zadanie jako wykonane:', onboardingId, taskId);
  }

  markMaterialAsViewed(onboardingId: string, materialId: string) {
    console.log('Oznacz materiał jako obejrzany:', onboardingId, materialId);
  }

  registerForWebinar(onboardingId: string, webinarId: string) {
    console.log('Rejestracja na webinar:', onboardingId, webinarId);
  }

  sendReminder(onboardingId: string) {
    console.log('Wyślij przypomnienie dla onboardingu:', onboardingId);
  }
}