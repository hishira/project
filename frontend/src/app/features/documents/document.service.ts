import { Injectable, signal } from '@angular/core';
import { Document } from './document.models';

@Injectable({ providedIn: 'root' })
export class DocumentService {
  private documentsData: Document[] = [
    {
      id: 'doc1',
      name: 'Umowa dostawy soków - Tymbark.pdf',
      type: 'contract',
      clientId: 'c1',
      clientName: 'Tymbark Sp. z o.o.',
      fileUrl: '/assets/docs/tymbar_contract.pdf',
      fileSize: 2_450_000,
      mimeType: 'application/pdf',
      uploadedAt: new Date('2025-01-15T10:30:00'),
      uploadedBy: 'Jan Kowalski',
      description: 'Umowa na dostawę soków bio na rok 2025',
      tags: ['umowa', 'bio'],
      version: '1.0',
      expiryDate: new Date('2025-12-31'),
      contractNumber: 'TM/2025/001',
      approved: true
    },
    {
      id: 'doc2',
      name: 'Aneks nr 1 do umowy Tymbark.docx',
      type: 'annex',
      clientId: 'c1',
      clientName: 'Tymbark Sp. z o.o.',
      fileUrl: '/assets/docs/tymbar_annex1.docx',
      fileSize: 180_000,
      mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      uploadedAt: new Date('2025-03-20T14:15:00'),
      uploadedBy: 'Anna Nowak',
      description: 'Zmiana terminów płatności',
      tags: ['aneks', 'płatności'],
      version: '1.1',
      annexTo: 'doc1',
      approved: true
    },
    {
      id: 'doc3',
      name: 'Specyfikacja techniczna soku jabłkowego.pdf',
      type: 'specification',
      clientId: 'c2',
      clientName: 'Capri-Sun Polska',
      fileUrl: '/assets/docs/capri_spec.pdf',
      fileSize: 890_000,
      mimeType: 'application/pdf',
      uploadedAt: new Date('2025-02-10T09:00:00'),
      uploadedBy: 'Piotr Wiśniewski',
      description: 'Szczegółowa specyfikacja składu i opakowania',
      tags: ['specyfikacja', 'jabłko'],
      version: '2.3',
      approved: true
    },
    {
      id: 'doc4',
      name: 'Protokół odbioru partii 12345.pdf',
      type: 'protocol',
      clientId: 'c3',
      clientName: 'PepsiCo Polska',
      fileUrl: '/assets/docs/pepsi_protocol.pdf',
      fileSize: 1_200_000,
      mimeType: 'application/pdf',
      uploadedAt: new Date('2025-04-05T11:20:00'),
      uploadedBy: 'Magdalena Zając',
      description: 'Protokół odbioru partii soków pomarańczowych',
      tags: ['protokół', 'odbior'],
      approved: true
    },
    {
      id: 'doc5',
      name: 'Umowa ramowa - Coca-Cola HBC.pdf',
      type: 'contract',
      clientId: 'c4',
      clientName: 'Coca-Cola HBC Polska',
      fileUrl: '/assets/docs/cola_contract.pdf',
      fileSize: 3_100_000,
      mimeType: 'application/pdf',
      uploadedAt: new Date('2025-01-05T16:45:00'),
      uploadedBy: 'Jan Kowalski',
      description: 'Umowa ramowa na dostawy 2025-2026',
      tags: ['umowa', 'ramowa'],
      version: '1.0',
      expiryDate: new Date('2026-12-31'),
      contractNumber: 'CCHBC/2025/001',
      approved: false
    }
  ];

  readonly documents = signal<Document[]>(this.documentsData);

  getDocumentById(id: string): Document | undefined {
    return this.documents().find(doc => doc.id === id);
  }

  // Symulacja usuwania / aktualizacji (można dodać później)
}