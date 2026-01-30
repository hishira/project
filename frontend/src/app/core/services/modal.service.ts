import { ComponentType } from "@angular/cdk/overlay";
import { Component, inject, Injectable } from "@angular/core";
import { MatDialog } from '@angular/material/dialog'

@Injectable()
export class ModalService {
    private readonly dialog = inject(MatDialog)

    open(component: ComponentType<unknown>, data?: any): void {
        this.dialog.open(component, data);
    }
}