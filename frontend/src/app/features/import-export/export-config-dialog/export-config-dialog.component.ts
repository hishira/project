import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogClose, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ExportEntity, ExportConfig, ExportField } from '../import-export.model';

@Component({
  selector: 'app-export-config-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    MatDialogClose,
  ],
  templateUrl: './export-config-dialog.component.html',
  styleUrls: ['./export-config-dialog.component.scss'],
})
export class ExportConfigDialogComponent {
  private dialogRef = inject(MatDialogRef<ExportConfigDialogComponent>);
  private readonly data = inject(MAT_DIALOG_DATA) as { entities: ExportEntity[] };

  readonly entities = this.data.entities;
  readonly selectedEntityId = signal(this.entities[0]?.id ?? '');
  readonly exportType = signal<'CSV' | 'JSON' | 'Excel'>('CSV');
  readonly selectedFields = signal<string[]>(this.entities[0]?.fields.map((field) => field.key) ?? []);

  selectEntity(entityId: string) {
    this.selectedEntityId.set(entityId);
    const entity = this.entities.find((item) => item.id === entityId);
    this.selectedFields.set(entity?.fields.map((field) => field.key) ?? []);
  }

  toggleField(fieldKey: string, checked: boolean) {
    this.selectedFields.update((current) => {
      if (checked) {
        return current.includes(fieldKey) ? current : [...current, fieldKey];
      }
      return current.filter((item) => item !== fieldKey);
    });
  }

  get currentFields(): ExportField[] {
    const entity = this.entities.find((item) => item.id === this.selectedEntityId());
    return entity?.fields ?? [];
  }

  confirm() {
    const entity = this.entities.find((item) => item.id === this.selectedEntityId());
    if (!entity) {
      return;
    }

    const config: ExportConfig = {
      entityId: entity.id,
      entityLabel: entity.label,
      fields: this.selectedFields(),
      type: this.exportType(),
      createdBy: 'Systemowy demo',
    };
    this.dialogRef.close(config);
  }
}
