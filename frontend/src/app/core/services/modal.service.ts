import { ComponentType } from "@angular/cdk/overlay";
import { Component, inject, Injectable } from "@angular/core";
import { MatDialog, MatDialogRef } from '@angular/material/dialog'

@Injectable()
export class ModalService {
    private readonly dialog = inject(MatDialog)

    open<T>(component: ComponentType<T>, data?: any): MatDialogRef<T> {
        return this.dialog.open(component, data);
    }
}