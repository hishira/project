// shared/components/action-buttons/action-buttons.component.ts
import { Component, input, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActionItem } from './action.model';

@Component({
  selector: 'app-action-buttons',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatMenuModule, MatTooltipModule],
  template: `
    @if (actions().length === 1) {
      <!-- Pojedyncza akcja -->
      <button
        mat-stroked-button
        [color]="actions()[0].color ?? 'primary'"
        [disabled]="actions()[0].disabled"
        [matTooltip]="actions()[0].tooltip ?? ''"
        (click)="actions()[0].handler()"
      >
        <mat-icon>{{ actions()[0].icon }}</mat-icon>
        {{ actions()[0].label }}
      </button>
    } @else if (actions().length > 1) {
      <!-- Wiele akcji – menu -->
      <button
      mat-icon-button 
      [disabled]="allDisabled()"
        [matTooltip]="tooltipText()"
        [matMenuTriggerFor]="menu"
      >
        <mat-icon>more_vert</mat-icon>
        
      </button>
      <mat-menu #menu="matMenu">
        @for (action of actions(); track action.label) {
          <button
            mat-menu-item
            [disabled]="action.disabled"
            (click)="action.handler()"
            [matTooltip]="action.tooltip ?? ''"
          >
            <mat-icon>{{ action.icon }}</mat-icon>
            {{ action.label }}
          </button>
        }
      </mat-menu>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActionButtonsComponent {
  /** Lista akcji – wymagana */
  readonly actions = input.required<ActionItem[]>();

  /** Czy wszystkie akcje są wyłączone? */
  protected allDisabled = computed(() => this.actions().every(a => a.disabled));

  /** Tekst tooltipa dla przycisku głównego */
  protected tooltipText = computed(() => {
    const disabledCount = this.actions().filter(a => a.disabled).length;
    if (disabledCount === this.actions().length) return 'Wszystkie akcje są niedostępne';
    return 'Kliknij, aby zobaczyć dostępne akcje';
  });
}