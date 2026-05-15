import { Injectable, ResourceRef } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { CrmTicket, PmIssue, Ticket, TicketDetails, TicketListItem, User } from '../types';
import { rxResource } from '@angular/core/rxjs-interop';
import { mockCrmTickets, mockPmIssues } from './ticket-details.dependency';

@Injectable({ providedIn: 'root' })
export class TicketDetailService {

    private allTickets: Ticket[] = [...mockCrmTickets, ...mockPmIssues];

    getResource(): ResourceRef<TicketDetails | undefined> {
        return rxResource<TicketDetails, any>({
            params: ()=> ({id: 'test'}),
            stream: ({params})=> this.getRandomTicketDetails(),
            defaultValue: undefined,
        })
    }
    // Symuluje pobieranie losowego ticketu z opóźnieniem
    private getRandomTicketDetails(): Observable<TicketDetails> {
        const randomIndex = Math.floor(Math.random() * this.allTickets.length);
        const ticket = this.allTickets[randomIndex];

        // Losowo wybieramy 1-3 powiązane tickety (inne niż ten)
        const otherTickets = this.allTickets.filter(t => t.id !== ticket.id);
        const shuffled = otherTickets.sort(() => 0.5 - Math.random());
        const related = shuffled.slice(0, Math.floor(Math.random() * 3) + 1).map(t => {
            // Mapujemy na TicketListItem (uproszczony)
            const listItem: TicketListItem = {
                id: t.id,
                ticketNumber: t.ticketNumber,
                title: t.title,
                description: t.description,
                type: t.type,
                status: t.status,
                priority: t.priority,
                createdAt: t.createdAt,
                updatedAt: t.updatedAt,
                createdBy: { id: t.createdBy.id, fullName: t.createdBy.fullName, avatarUrl: t.createdBy.avatarUrl },
                assignedTo: t.assignedTo ? { id: t.assignedTo.id, fullName: t.assignedTo.fullName, avatarUrl: t.assignedTo.avatarUrl } : undefined,
                commentCount: t.comments.length,
                attachmentCount: t.attachments.length,
                tags: t.tags,
                issueType: t.type === 'pm' ? t.issueType : undefined,
                customerName: t.type === 'crm' ? t.customer?.fullName : undefined,
                selected: false,
                isExpanded: false
            };
            return listItem;
        });

        const details: TicketDetails = {
            ...ticket,
            relatedTickets: related,
            timeTracking: {
                totalTimeSpent: Math.floor(Math.random() * 480) + 60, // 1-8h w minutach
                timeRemaining: Math.floor(Math.random() * 240) + 30
            },
            isLoading: false,
            error: undefined
        };

        // Symulacja opóźnienia sieciowego
        return of(details).pipe(delay(1000));
    }
}