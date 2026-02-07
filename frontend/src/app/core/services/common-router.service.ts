import { inject, Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable()
export class CommonRouterService {
  private readonly router = inject(Router);
  private readonly activeRoute = inject(ActivatedRoute);

  navigateToByString(path: string, pathSeparator: string): void {
    this.router.navigate(path.split(pathSeparator), { relativeTo: this.activeRoute });
  }

  navitgateTo(paths: string[], usingRelative = true): void {
    this.router.navigate(paths, usingRelative ? { relativeTo: this.activeRoute } : {});
  }
}
