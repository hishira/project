import { NgFor, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatGridListModule } from '@angular/material/grid-list';
import { GenericInputComponent } from '../generic-input/generic-input.component';
import { GenericEdit } from '../types';
@Component({
  selector: 'crm-generic-group',
  templateUrl: './generic-group.component.html',
  styleUrls: ['./generic-group.scss'],
  standalone: true,
  imports: [
    MatGridListModule,
    GenericInputComponent,
    ReactiveFormsModule,
    NgFor,
    NgIf,
  ],
})
export class GenericGroupComponent {
  @Input() genericEditGroup!: GenericEdit;
  @Input() groupForm!: FormGroup;
}
