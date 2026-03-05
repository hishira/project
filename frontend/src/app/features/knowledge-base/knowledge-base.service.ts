import { Injectable, signal } from '@angular/core';
import { ArticleCategory, KnowledgeArticle } from './knowledge-base.model';

@Injectable({ providedIn: 'root' })
export class KnowledgeBaseService {
  private articlesData: KnowledgeArticle[] = [
    {
      id: '1',
      title: 'Jak zresetować hasło?',
      content: 'Aby zresetować hasło, kliknij link "Zapomniałeś hasła?" na stronie logowania. Na podany adres e-mail otrzymasz link do ustawienia nowego hasła.',
      category: 'faq',
      tags: ['hasło', 'logowanie'],
      createdAt: new Date('2025-01-10'),
      updatedAt: new Date('2025-02-15'),
      author: 'Jan Kowalski',
      views: 1250,
      helpful: 87
    },
    {
      id: '2',
      title: 'Konfiguracja klienta poczty',
      content: 'Instrukcja krok po kroku jak skonfigurować program pocztowy (Outlook, Thunderbird) z naszym serwerem.',
      category: 'instruction',
      tags: ['poczta', 'konfiguracja'],
      createdAt: new Date('2025-01-20'),
      updatedAt: new Date('2025-03-01'),
      author: 'Anna Nowak',
      views: 830,
      helpful: 42
    },
    {
      id: '3',
      title: 'Najlepsze praktyki tworzenia ofert',
      content: 'Poradnik jak tworzyć skuteczne oferty handlowe, które zwiększają szansę na konwersję.',
      category: 'guide',
      tags: ['sprzedaż', 'oferty'],
      createdAt: new Date('2025-02-05'),
      updatedAt: new Date('2025-02-20'),
      author: 'Piotr Wiśniewski',
      views: 540,
      helpful: 31
    },
    {
      id: '4',
      title: 'Jak dodać nowego użytkownika?',
      content: 'Przejdź do panelu administracyjnego → Użytkownicy → Dodaj nowego. Wypełnij formularz i nadaj odpowiednie uprawnienia.',
      category: 'faq',
      tags: ['użytkownicy', 'admin'],
      createdAt: new Date('2025-01-15'),
      updatedAt: new Date('2025-01-15'),
      author: 'Magdalena Zając',
      views: 420,
      helpful: 19
    },
    {
      id: '5',
      title: 'Integracja z systemem ERP',
      content: 'Instrukcja techniczna dla programistów: jak skonfigurować połączenie REST API między CRM a ERP.',
      category: 'instruction',
      tags: ['API', 'integracja'],
      createdAt: new Date('2025-02-28'),
      updatedAt: new Date('2025-03-02'),
      author: 'Tomasz Nowicki',
      views: 310,
      helpful: 12
    }
  ];

  readonly articles = signal<KnowledgeArticle[]>(this.articlesData);

  getArticleById(id: string): KnowledgeArticle | undefined {
    return this.articles().find(a => a.id === id);
  }

  getArticlesByCategory(category: ArticleCategory): KnowledgeArticle[] {
    return this.articles().filter(a => a.category === category);
  }

  // Symulacja dodawania artykułu
  addArticle(article: Omit<KnowledgeArticle, 'id' | 'createdAt' | 'views' | 'helpful'>) {
    console.log('Dodawanie artykułu (symulacja):', article);
    // W rzeczywistości wysłalibyśmy dane do API
  }

  // Symulacja edycji
  updateArticle(id: string, changes: Partial<KnowledgeArticle>) {
    console.log('Aktualizacja artykułu (symulacja):', id, changes);
  }

  // Symulacja usunięcia
  deleteArticle(id: string) {
    console.log('Usuwanie artykułu (symulacja):', id);
  }
}