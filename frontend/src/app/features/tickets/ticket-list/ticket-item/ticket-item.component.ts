import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { TicketListItem, TicketStatus } from '../../types';
import { getPriorityIcon, getPriorityColor, getStatusLabel, getStatusClass } from '../../ticket-status.utils';

@Component({
  selector: 'app-ticket-item',
  standalone: true,
  imports: [
    CommonModule,
    MatCheckboxModule,
    MatIconModule,
    MatChipsModule,
    MatButtonModule,
    MatTooltipModule,
    MatMenuModule,
    MatDividerModule,
    MatExpansionModule
  ],
  template: `
    <mat-expansion-panel
      class="ticket-card"
      hideToggle
      [expanded]="ticket().isExpanded"
      (closed)="onCollapse()"
      (opened)="onExpand()">
      <mat-expansion-panel-header class="ticket-header">
        <div class="header-content">
          <mat-checkbox
            class="ticket-checkbox"
            [checked]="ticket().selected"
            (change)="onToggleSelection()"
            (click)="$event.stopPropagation()" />

          <mat-icon
            class="type-icon"
            [class.crm]="ticket().type === 'crm'"
            [class.pm]="ticket().type === 'pm'"
            [matTooltip]="ticket().type === 'crm' ? 'CRM' : 'Projekt'">
            {{ getTypeIcon() }}
          </mat-icon>

          <div class="ticket-main">
            <span class="ticket-number">{{ ticket().ticketNumber }}</span>
            <span class="ticket-title">{{ ticket().title }}</span>
            @if (ticket().type === 'crm' && ticket().customerName) {
              <span class="customer-badge">{{ ticket().customerName }}</span>
            }
            @if (ticket().type === 'pm' && ticket().issueType) {
              <span class="issue-type-badge">{{ ticket().issueType }}</span>
            }
          </div>

          <mat-chip-set class="priority-chip">
            <mat-chip
              [matTooltip]="'Priorytet: ' + ticket().priority"
              [style.background]="getPriorityColor(ticket().priority)"
              [style.color]="'white'">
              <mat-icon>{{ getPriorityIcon(ticket().priority) }}</mat-icon>
              {{ ticket().priority }}
            </mat-chip>
          </mat-chip-set>

          <mat-chip-set class="status-chip">
            <mat-chip [class]="getStatusClass(ticket().status)">
              {{ getStatusLabel(ticket().status) }}
            </mat-chip>
          </mat-chip-set>

          <div class="assignee-info">
            @if (ticket().assignedTo) {
              <div class="avatar-group" matTooltip="Przypisane do: {{ ticket().assignedTo!.fullName }}">
                <img alt="avatar" class="avatar" [src]="ticket().assignedTo!.avatarUrl" />
              </div>
            } @else {
              <span class="unassigned">Nieprzypisane</span>
            }
          </div>

          <div class="counters">
            @if (ticket().commentCount > 0) {
              <span class="counter" matTooltip="Komentarze">
                <mat-icon>comment</mat-icon> {{ ticket().commentCount }}
              </span>
            }
            @if (ticket().attachmentCount > 0) {
              <span class="counter" matTooltip="Załączniki">
                <mat-icon>attach_file</mat-icon> {{ ticket().attachmentCount }}
              </span>
            }
          </div>

          <button mat-icon-button [matMenuTriggerFor]="menu" (click)="$event.stopPropagation()">
            <mat-icon>more_vert</mat-icon>
          </button>
          <mat-menu #menu="matMenu">
            <button mat-menu-item (click)="onEdit(); $event.stopPropagation()">
              <mat-icon>edit</mat-icon> Edytuj
            </button>
            <button mat-menu-item (click)="onDetails(); $event.stopPropagation()">
              <mat-icon>details</mat-icon> Details
            </button>
            <button mat-menu-item [matMenuTriggerFor]="statusMenu" (click)="$event.stopPropagation()">
              <mat-icon>swap_horiz</mat-icon> Zmień status
            </button>
            <button mat-menu-item (click)="onAssign(); $event.stopPropagation()">
              <mat-icon>assignment_ind</mat-icon> Przypisz do mnie
            </button>
          </mat-menu>
          <mat-menu #statusMenu="matMenu">
            @for (status of statusOptions; track status) {
              <button mat-menu-item (click)="onChangeStatus(status); $event.stopPropagation()">
                {{ getStatusLabel(status) }}
              </button>
            }
          </mat-menu>
        </div>
      </mat-expansion-panel-header>

      <div class="expanded-content">
        @if (ticket().description) {
          <p class="description">{{ ticket().description }}</p>
        }
        <div class="meta-details">
          <div class="meta-item">
            <mat-icon>person</mat-icon>
            <span>Utworzył: {{ ticket().createdBy.fullName }}</span>
          </div>
          <div class="meta-item">
            <mat-icon>schedule</mat-icon>
            <span>Utworzono: {{ ticket().createdAt | date: 'dd MMM yyyy, HH:mm' }}</span>
          </div>
          <div class="meta-item">
            <mat-icon>update</mat-icon>
            <span>Aktualizacja: {{ ticket().updatedAt | date: 'dd MMM yyyy, HH:mm' }}</span>
          </div>
          @if (ticket().type === 'crm') {
            <div class="meta-item">
              <mat-icon>business</mat-icon>
              <span>Klient: {{ ticket().customerName }}</span>
            </div>
          }
          @if (ticket().type === 'pm' && ticket().issueType) {
            <div class="meta-item">
              <mat-icon>bug_report</mat-icon>
              <span>Typ: {{ ticket().issueType }}</span>
            </div>
          }
        </div>
        @if (ticket().tags.length > 0) {
          <div class="tags">
            <mat-chip-set>
              @for (tag of ticket().tags; track tag) {
                <mat-chip>{{ tag }}</mat-chip>
              }
            </mat-chip-set>
          </div>
        }
      </div>
    </mat-expansion-panel>
  `,
  styles: [`
    .ticket-card {
      border-radius: 12px !important;
      box-shadow: 0 2px 6px rgba(0,0,0,0.05) !important;
      transition: box-shadow 0.2s;
      &:hover {
        box-shadow: 0 4px 12px rgba(0,0,0,0.1) !important;
      }
    }
    .ticket-header {
      padding: 0 16px !important;
      height: auto !important;
      min-height: 72px;
    }
    .header-content {
      display: flex;
      align-items: center;
      width: 100%;
      gap: 16px;
      flex-wrap: wrap;
    }
    .ticket-checkbox {
      margin-right: 4px;
    }
    .type-icon {
      &.crm { color: #1976d2; }
      &.pm { color: #7b1fa2; }
    }
    .ticket-main {
      flex: 2;
      min-width: 200px;
      .ticket-number {
        font-family: 'Roboto Mono', monospace;
        font-weight: 500;
        background: #f1f5f9;
        padding: 2px 8px;
        border-radius: 16px;
        font-size: 0.8rem;
        margin-right: 12px;
        color: #334155;
      }
      .ticket-title {
        font-weight: 500;
        color: #0f172a;
      }
      .customer-badge,
      .issue-type-badge {
        display: inline-block;
        background: #e0f2fe;
        color: #0369a1;
        font-size: 0.7rem;
        padding: 2px 8px;
        border-radius: 12px;
        margin-left: 8px;
        text-transform: uppercase;
        font-weight: 600;
      }
      .issue-type-badge {
        background: #ede7f6;
        color: #5e35b1;
      }
    }
    .priority-chip {
      min-width: 90px;
      .mat-mdc-chip {
        padding: 0 12px;
        font-size: 0.8rem;
        font-weight: 500;
        text-transform: uppercase;
        height: 28px;
        mat-icon {
          font-size: 16px;
          width: 16px;
          height: 16px;
          margin-right: 4px;
        }
      }
    }
    .status-chip {
      .mat-mdc-chip {
        font-size: 0.8rem;
        font-weight: 500;
        padding: 0 12px;
        height: 28px;
        background-color: #f1f5f9;
        color: #1e293b;
      }
      .status-new { background-color: #e3f2fd !important; color: #0d47a1 !important; }
      .status-in-progress { background-color: #fff3e0 !important; color: #b45309 !important; }
      .status-waiting-for-customer { background-color: #f3e5f5 !important; color: #7b1fa2 !important; }
      .status-resolved { background-color: #e8f5e8 !important; color: #2e7d32 !important; }
      .status-closed { background-color: #e0e0e0 !important; color: #424242 !important; }
      .status-todo { background-color: #f1f5f9 !important; color: #334155 !important; }
      .status-doing { background-color: #fef3c7 !important; color: #92400e !important; }
      .status-done { background-color: #d1fae5 !important; color: #065f46 !important; }
    }
    .assignee-info {
      display: flex;
      align-items: center;
      min-width: 40px;
      justify-content: center;
      .avatar-group {
        .avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
      }
      .unassigned {
        font-size: 0.75rem;
        color: #94a3b8;
        font-style: italic;
      }
    }
    .counters {
      display: flex;
      gap: 12px;
      color: #64748b;
      .counter {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 0.75rem;
        mat-icon {
          font-size: 16px;
          width: 16px;
          height: 16px;
        }
      }
    }
    .expanded-content {
      padding: 16px 0 8px;
    }
    .description {
      background: #f8fafc;
      padding: 12px;
      border-radius: 8px;
      margin: 0 0 16px 0;
      color: #334155;
      line-height: 1.5;
    }
    .meta-details {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 12px;
      margin-bottom: 16px;
      .meta-item {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 0.9rem;
        color: #475569;
        mat-icon {
          font-size: 18px;
          width: 18px;
          height: 18px;
          color: #64748b;
        }
      }
    }
    .tags {
      .mat-mdc-chip {
        background-color: #f1f5f9;
        color: #334155;
      }
    }
    @media (max-width: 900px) {
      .header-content { gap: 8px; }
      .ticket-main { min-width: 150px; }
      .priority-chip, .status-chip { min-width: auto; }
      .counters { display: none; }
    }
    @media (max-width: 600px) {
      .ticket-header { flex-wrap: wrap; }
      .assignee-info { order: 3; }
      .ticket-main { width: 100%; order: 1; margin-bottom: 8px; }
    }
  `]
})
export class TicketItemComponent {
  ticket = input.required<TicketListItem>();

  expand = output<void>();
  collapse = output<void>();
  toggleSelection = output<void>();
  edit = output<void>();
  details = output<void>();
  assign = output<void>();
  changeStatus = output<TicketStatus>();

  getPriorityIcon = getPriorityIcon;
  getPriorityColor = getPriorityColor;
  getStatusLabel = getStatusLabel;
  getStatusClass = getStatusClass;

  statusOptions: TicketStatus[] = [
    'new', 'in_progress', 'waiting_for_customer', 'resolved', 'closed',
    'todo', 'doing', 'done'
  ];

  getTypeIcon(): string {
    return this.ticket().type === 'crm' ? 'support_agent' : 'bug_report';
  }

  onExpand() {
    this.expand.emit();
  }

  onCollapse() {
    this.collapse.emit();
  }

  onToggleSelection() {
    this.toggleSelection.emit();
  }

  onEdit() {
    this.edit.emit();
  }

  onDetails() {
    this.details.emit();
  }

  onAssign() {
    this.assign.emit();
  }

  onChangeStatus(status: TicketStatus) {
    this.changeStatus.emit(status);
  }
}
