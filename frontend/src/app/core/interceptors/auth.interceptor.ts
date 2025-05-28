import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { catchError, switchMap, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Skip interceptor for auth endpoints to avoid infinite loops
  if (req.url.includes('/auth/login') || 
      req.url.includes('/auth/register') || 
      req.url.includes('/auth/refresh')) {
    return next(req);
  }

  const token = authService.getToken();
  
  // Clone request and add auth header if token exists
  const authReq = token ? req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  }) : req;

  return next(authReq).pipe(
    catchError(error => {
      // Handle 401 errors by attempting token refresh
      if (error.status === 401 && token) {
        return authService.refreshToken().pipe(
          switchMap(() => {
            // Retry original request with new token
            const newToken = authService.getToken();
            const retryReq = newToken ? req.clone({
              setHeaders: {
                Authorization: `Bearer ${newToken}`
              }
            }) : req;
            
            return next(retryReq);
          }),
          catchError(refreshError => {
            // Refresh failed, redirect to login
            authService.logout().subscribe();
            router.navigate(['/auth/login']);
            return throwError(refreshError);
          })
        );
      }
      
      return throwError(error);
    })
  );
};
