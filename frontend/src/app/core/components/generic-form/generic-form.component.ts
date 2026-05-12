import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { GenericEdit } from './types';

@Component({
  selector: 'app-generic-form',
  templateUrl: './generic-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
})
export class GenericFormComponent {
  readonly genericEditDescription = input.required<GenericEdit>();
}