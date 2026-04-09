import { Component, computed, inject, Signal } from "@angular/core";
import { ChangeDetectionStrategy } from "@angular/core";
import { MainPageViewComponent } from "../../../core/components/main-page-view/main-page-view.component";
import { PageHeaderComponent } from "../../../core/components/page-header/page-header.component";
import { Agreement } from "../types";
import { agreement } from "./mock";
import { AgreementDetailStore } from "./agreement-details.store";
import { AgreementActionsComponent } from "./agreement-actions/agreement-actions.component";
import { PaymentScheduleComponent } from "./agreement-payments/agreement-payments.component";
import { AgreementSummaryComponent } from "./agreement-summary/agreement-summary.component";
import { AgreementProductInfoComponent } from "./agreement-product-info/agreement-product-info.component";
import { AgreementPartiesComponent } from "./agreement-parties/agreement-parties.component";
import { AgreementSignaturesRiskComponent } from "./agreement-signatures-risk/agreement-signatures-risk.component";
import { AgreementTagsComponent } from "./agreement-tags/agreement-tags.component";

@Component({
    selector: 'app-agreement-details',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './agreement-details.component.html',
    styleUrl: './agreement-details.component.scss',
    standalone: true,
    imports: [
        MainPageViewComponent,
        PageHeaderComponent,
        AgreementActionsComponent,
        PaymentScheduleComponent,
        AgreementSummaryComponent,
        AgreementProductInfoComponent,
        AgreementPartiesComponent,
        AgreementSignaturesRiskComponent,
        AgreementTagsComponent
    ],
    providers: [AgreementDetailStore],
})
export class AgreementDetailsComponent {
    readonly agreementStore = inject(AgreementDetailStore);
    readonly agreement: Signal<Agreement> = computed(() => this.agreementStore.agreement() as unknown as Agreement);

    constructor() {
        this.agreementStore.setAgreement(agreement);
    }
}