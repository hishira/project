import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
    selector: 'app-agreement-details',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './agreement-details.component.html',
    standalone: true,
    imports: [],
})
export class AgreemmentDetailsComponent{

}