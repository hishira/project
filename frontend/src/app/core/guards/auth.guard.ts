import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { UserActions } from '../../store/user';
import { adminUserMock, authResponseMock } from '../mocks/response.mock';
import { User } from '../../shared/models/auth.model';
import {
  RefreshTokenActions,
  RefreshTokenEvents,
} from '../../store/refresh-token';
import {
  AccessTokenActions,
  AccessTokenEvents,
} from '../../store/access-token';

export const authGuard = () => {
  const authService = inject(AuthService);
  const store = inject(Store);
  const router = inject(Router);
  store.dispatch(UserActions.set(adminUserMock as unknown as User));
  store.dispatch(
    RefreshTokenActions[RefreshTokenEvents.Set]({
      refreshToken: authResponseMock.refresh_token,
    })
  );
  store.dispatch(
    AccessTokenActions[AccessTokenEvents.Set]({
      accessToken: authResponseMock.access_token,
    })
  );
  return true;
  return authService.isAuthenticated$.pipe(
    take(1),
    map((isAuthenticated) => {
      if (!isAuthenticated) {
        router.navigate(['/auth/login']);
        return false;
      }
      return true;
    })
  );
};
