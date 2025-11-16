import { ChangeDetectionStrategy, Component } from '@angular/core';
@Component({
    selector: 'app-user-details',
    templateUrl: './user-details.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [],
})
export class UserDetailsComponent {}