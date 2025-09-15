import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import {
  AuthResponse,
  ChangePasswordDto,
  LoginDto,
  RefreshTokenDto,
  RegisterDto,
  User,
  UserSession,
} from '../../shared/models/auth.model';
import {
  AccessTokenActions,
  AccessTokenEvents,
} from '../../store/access-token';
import {
  RefreshTokenActions,
  RefreshTokenEvents,
} from '../../store/refresh-token';
import { UserActions } from '../../store/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly API_URL = environment.apiUrl || 'http://localhost:3000';
  private readonly TOKEN_KEY = 'access_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private readonly USER_KEY = 'current_user';

  private readonly currentUserSubject = new BehaviorSubject<User | null>(
    this.getUserFromStorage()
  );
  public readonly currentUser$ = this.currentUserSubject.asObservable();

  private readonly isAuthenticatedSubject = new BehaviorSubject<boolean>(
    this.hasValidToken()
  );
  public readonly isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router,
    private readonly store: Store
  ) {
    // Check token validity on service initialization
    this.validateStoredToken();
  }

  // Authentication methods
  register(registerDto: RegisterDto): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.API_URL}/auth/register`, registerDto)
      .pipe(
        tap((response) => this.handleAuthSuccess(response)),
        catchError(this.handleError)
      );
  }

  login(loginDto: LoginDto): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.API_URL}/auth/login`, loginDto)
      .pipe(
        tap((response) => this.handleAuthSuccess(response)),
        catchError(this.handleError)
      );
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${this.API_URL}/auth/logout`, {}).pipe(
      tap(() => this.handleLogout()),
      catchError(() => {
        // Even if logout fails on server, clear local storage
        this.handleLogout();
        return throwError('Logout failed on server');
      })
    );
  }

  refreshToken(): Observable<AuthResponse> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      return throwError('No refresh token available');
    }

    const refreshDto: RefreshTokenDto = { refresh_token: refreshToken };
    return this.http
      .post<AuthResponse>(`${this.API_URL}/auth/refresh`, refreshDto)
      .pipe(
        tap((response) => this.handleAuthSuccess(response)),
        catchError((error) => {
          this.handleLogout();
          return throwError(error);
        })
      );
  }

  changePassword(
    changePasswordDto: ChangePasswordDto
  ): Observable<{ message: string }> {
    return this.http
      .patch<{ message: string }>(
        `${this.API_URL}/auth/change-password`,
        changePasswordDto
      )
      .pipe(catchError(this.handleError));
  }

  getMe(): Observable<User> {
    return this.http.get<User>(`${this.API_URL}/auth/me`).pipe(
      tap((user) => {
        this.setUser(user);
        this.currentUserSubject.next(user);
      }),
      catchError(this.handleError)
    );
  }

  // Session management
  getSessions(): Observable<UserSession[]> {
    return this.http
      .get<UserSession[]>(`${this.API_URL}/auth/sessions`)
      .pipe(catchError(this.handleError));
  }

  getActiveSessionCount(): Observable<{ count: number }> {
    return this.http
      .get<{ count: number }>(`${this.API_URL}/auth/sessions/count`)
      .pipe(catchError(this.handleError));
  }

  deleteSession(sessionId: string): Observable<void> {
    return this.http
      .delete<void>(`${this.API_URL}/auth/sessions/${sessionId}`)
      .pipe(catchError(this.handleError));
  }

  deleteAllSessions(): Observable<void> {
    return this.http
      .delete<void>(`${this.API_URL}/auth/sessions`)
      .pipe(catchError(this.handleError));
  }

  // Token management
  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.TOKEN_KEY);
    }
    return null;
  }

  getRefreshToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.REFRESH_TOKEN_KEY);
    }
    return null;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  // Private helper methods
  private handleAuthSuccess(response: AuthResponse): void {
    this.setToken(response.access_token);
    this.setRefreshToken(response.refresh_token);
    this.setUser(response.user);
    this.currentUserSubject.next(response.user);
    this.isAuthenticatedSubject.next(true);
  }

  private handleLogout(): void {
    this.clearStorage();
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/auth/login']);
  }

  private setToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.TOKEN_KEY, token);
      this.store.dispatch(
        AccessTokenActions[AccessTokenEvents.Set]({ accessToken: token })
      );
    }
  }

  private setRefreshToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.REFRESH_TOKEN_KEY, token);
      this.store.dispatch(
        RefreshTokenActions[RefreshTokenEvents.Set]({ refreshToken: token })
      );
    }
  }

  private setUser(user: User): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
      console.log(user);
      this.store.dispatch(UserActions.set(user));
    }
  }

  private getUserFromStorage(): User | null {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem(this.USER_KEY);
      return user ? JSON.parse(user) : null;
    }
    return null;
  }

  private hasValidToken(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const now = Math.floor(Date.now() / 1000);
      return payload.exp > now;
    } catch {
      return false;
    }
  }

  private validateStoredToken(): void {
    if (!this.hasValidToken()) {
      this.clearStorage();
      this.isAuthenticatedSubject.next(false);
      this.currentUserSubject.next(null);
    }
  }

  private clearStorage(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.REFRESH_TOKEN_KEY);
      localStorage.removeItem(this.USER_KEY);
    }
  }

  private handleError = (error: any): Observable<never> => {
    let errorMessage = 'An unexpected error occurred';

    if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.message) {
      errorMessage = error.message;
    }

    // Handle 401 errors by logging out
    if (error.status === 401) {
      this.handleLogout();
    }

    return throwError(errorMessage);
  };
}
