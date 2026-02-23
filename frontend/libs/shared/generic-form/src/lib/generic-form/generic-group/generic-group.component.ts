import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatGridListModule } from '@angular/material/grid-list';
import { GenericInputComponent } from '../generic-input/generic-input.component';
import { GenericEdit } from '../types';
@Component({
  selector: 'crm-generic-group',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './generic-group.component.html',
  styleUrls: ['./generic-group.scss'],
  standalone: true,
  imports: [
    MatGridListModule,
    GenericInputComponent,
    ReactiveFormsModule,
  ],
})
export class GenericGroupComponent {
  readonly genericEditGroup = input.required<GenericEdit>();
  readonly groupForm = input.required<FormGroup>();
  //@Input() genericEditGroup!: GenericEdit;
  //@Input() groupForm!: FormGroup;
}
