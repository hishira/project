import { Component, inject, output } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { Router } from "@angular/router";
import { firstValueFrom } from "rxjs";
import { AuthenticationService } from "../../services/auth.service";
import { SnackBar } from "../../services/snack-bar.service";

@Component({
    selector: 'app-side-nav-list',
    templateUrl: './side-nav-list.component.html',
    styleUrl: './side-nav-list.component.scss',
    imports: [MatIconModule],
})
export class SideNavListComponent {
    private authService = inject(AuthenticationService);
    private snackBar = inject(SnackBar);
    private router = inject(Router);

    readonly closed = output<void>();

    close(): void {
        this.closed.emit();
    }

    async logout(): Promise<void> {
        try {
            await firstValueFrom(this.authService.logout());
            this.snackBar.openSuccess('Logged out successfully');
            this.router.navigate(['/auth/login']);
        } catch (error) {
            console.error('Logout error:', error);
            this.snackBar.openError('Unable to log out. Please try again.');
        }
    }
}