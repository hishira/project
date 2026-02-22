import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { provideState, provideStore } from '@ngrx/store';
// import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { MoveBackService } from './core/services/move-back.service';
import { accessTokenReducer } from './store/access-token';
import { refreshTokenReducer } from './store/refresh-token';
import { userReducer } from './store/user';

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
    MoveBackService,
    //provideCharts(withDefaultRegisterables())
  ],
};
