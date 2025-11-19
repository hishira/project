import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ReadonlyOnlyComponent } from '../../core/components/read-only/read-only.component';

@Component({
    selector: 'app-user-details',
    templateUrl: './user-details.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [MatCardModule, ReadonlyOnlyComponent],
})
export class UserDetailsComponent {}