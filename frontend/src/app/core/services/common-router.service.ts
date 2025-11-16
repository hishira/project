import { inject, Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable()
export class CommonRouterService {
  private readonly router = inject(Router);
  private readonly activeRoute = inject(ActivatedRoute);

  navitgateTo(paths: string[]): void {
    this.router.navigate(paths, { relativeTo: this.activeRoute });
  }
}
