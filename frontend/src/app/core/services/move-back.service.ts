import { computed, inject, Injectable, signal, WritableSignal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Event, EventType, Router } from '@angular/router';
import { filter } from 'rxjs';

@Injectable()
export class MoveBackService {
  private readonly router: Router = inject(Router);
  private readonly history: WritableSignal<string[]> = signal([]);
  readonly isHistoryEmpty = computed(() => this.history().length <= 0);
  constructor() {
    this.router.events
      .pipe(
        filter((event: Event) => event.type === EventType.NavigationStart),
        takeUntilDestroyed(),
      )
      .subscribe((e) => {
        this.history.update((history) => [...history, this.router.url]);
      });
  }

  moveBack(): Promise<boolean> {
    const history = this.history();
    const lastPath = history.pop();
    this.history.set(history);
    return lastPath ? this.router.navigate([lastPath]) : Promise.resolve(false);
  }
}
