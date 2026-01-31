import { ChangeDetectionStrategy, Component, signal } from "@angular/core";
import { sampleAgreements } from "./mocks";

@Component({
    selector: 'app-user-agreements',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './user-agreements.component.html',
    imports: [],
})
export class UserAgreementsComponent{
    readonly userAgreements = signal(sampleAgreements)
}