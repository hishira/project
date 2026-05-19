import { Directive, inject, OnInit, Signal, TemplateRef, ViewContainerRef } from "@angular/core";
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from "@ngrx/store";
import { User } from "../../shared/models/user.model";
import { userSelector } from "../../store/user";

@Directive({
    selector: '[isAdmin]',
})
export class AdminDirective implements OnInit{
    private readonly temmplateRef = inject(TemplateRef);
    private readonly viewContainer = inject(ViewContainerRef);
    private readonly user: Signal<User | any> = toSignal(inject(Store).select(userSelector));

    ngOnInit(): void {
        if (this.user()?.role?.roleType?.roleType === 'admin') {
            this.viewContainer.createEmbeddedView(this.temmplateRef);
        }
        else {
            this.viewContainer.clear();
        }
    }
}