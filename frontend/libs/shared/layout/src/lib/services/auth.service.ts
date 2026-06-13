import { InjectionToken } from "@angular/core";
import { Observable } from "rxjs";

export interface AuthenticationService {
    logout(): Observable<void>;
    currentUser$: Observable<any>;
}

export const AuthenticationService = new InjectionToken<AuthenticationService>('authentication_service_interface');