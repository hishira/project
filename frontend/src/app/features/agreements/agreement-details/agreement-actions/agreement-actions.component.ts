import { Component, input, ChangeDetectionStrategy, inject, Signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { AgreementDetailStore } from '../agreement-details.store';
import { Agreement } from '../../types';

export type AgreementStatus = 'ACTIVE' | 'EXPIRED' | 'DRAFT';

@Component({
    selector: 'app-agreement-actions',
    templateUrl: './agreement-actions.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        CommonModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule
    ],
    styles: [`
    .d-flex {
      display: flex;
    }
    .gap-2 {
      gap: 0.5rem;
    }
    .mt-4 {
      margin-top: 1.5rem;
    }
  `]
})
export class AgreementActionsComponent {
        readonly agreementStore = inject(AgreementDetailStore)
        readonly agreement = this.agreementStore.agreement as Signal<Agreement>;

}