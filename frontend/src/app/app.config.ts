import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { provideState, provideStore, Store } from '@ngrx/store';
import { userReducer } from './store/user';
import { accessTokenReducer } from './store/access-token';
import { refreshTokenReducer } from './store/refresh-token';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideStore(),
    provideState({
      name: 'user',
      reducer: userReducer,
    }),
    provideState({
      name: 'accessToken',
      reducer: accessTokenReducer,
    }),
    provideState({
      name: 'refreshToken',
      reducer: refreshTokenReducer,
    }),
    // provideState({
    //   user: userReducer,
    //   accessToken: accessTokenReducer,
    //   refreshToken: refreshTokenReducer
    // }),
  ],
};
