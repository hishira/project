import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Sentiment } from '../../../features/social/social.model';
import { SENTIMENT_COLORS, SENTIMENT_ICONS } from '../social-icons/social-icons.constants';

@Component({
  selector: 'app-sentiment-icon',
  standalone: true,
  imports: [MatIconModule, MatTooltipModule],
  template: `
    <mat-icon [style.color]="getColor()" [matTooltip]="sentiment()">
      {{ getIcon() }}
    </mat-icon>
  `,
  styles: [`
    :host {
      display: inline-flex;
    }
  `]
})
export class SentimentIconComponent {
  readonly sentiment = input.required<Sentiment>();

  getIcon(): string {
    return SENTIMENT_ICONS[this.sentiment()];
  }

  getColor(): string {
    return SENTIMENT_COLORS[this.sentiment()];
  }
}
