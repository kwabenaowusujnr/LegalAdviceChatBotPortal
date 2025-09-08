import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of } from 'rxjs';
import {
  ServiceProxy,
  UserLoginInputDto,
  AuthResponse,
  UserRegistrationInputDto,
} from './api-client';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(
    this.hasValidToken()
  );
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private apiClient: ServiceProxy) {
    // Check authentication status on service initialization
    this.checkAuthStatus();
  }

  private hasValidToken(): boolean {
    const token = localStorage.getItem('authToken');
    return !!token;
  }

  private checkAuthStatus(): void {
    const isAuth = this.hasValidToken();
    this.isAuthenticatedSubject.next(isAuth);
  }

  login(email: string, password: string): Observable<boolean> {
    const loginDto = new UserLoginInputDto();
    loginDto.email = email;
    loginDto.password = password;

    return this.apiClient.login(loginDto).pipe(
      map((response: AuthResponse) => {
        if (response.token && response.user) {
          // Store authentication data
          localStorage.setItem('authToken', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));

          if (response.expiresAt) {
            localStorage.setItem(
              'tokenExpiresAt',
              response.expiresAt.toISOString()
            );
          }

          this.isAuthenticatedSubject.next(true);
          return true;
        }
        return false;
      }),
      catchError((error) => {
        console.error('Login failed:', error);
        return of(false);
      })
    );
  }

  register(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    region: string;
  }): Observable<boolean> {
    const registerDto = new UserRegistrationInputDto();
    registerDto.email = userData.email;
    registerDto.password = userData.password;
    registerDto.firstName = userData.firstName;
    registerDto.lastName = userData.lastName;
    registerDto.phoneNumber = userData.phoneNumber;
    registerDto.region = userData.region;

    return this.apiClient.register(registerDto).pipe(
      map((response: AuthResponse) => {
        if (response.token && response.user) {
          // Store authentication data
          localStorage.setItem('authToken', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));

          if (response.expiresAt) {
            localStorage.setItem(
              'tokenExpiresAt',
              response.expiresAt.toISOString()
            );
          }

          this.isAuthenticatedSubject.next(true);
          return true;
        }
        return false;
      }),
      catchError((error) => {
        console.error('Registration failed:', error);
        return of(false);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('tokenExpiresAt');
    localStorage.removeItem('user');
    sessionStorage.clear();
    this.isAuthenticatedSubject.next(false);
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  getCurrentUser() {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  }

  getAuthToken(): string | null {
    return localStorage.getItem('authToken');
  }

  /*

  login(email: string, password: string): Observable<boolean> {
    return new Observable((observer) => {
      // Simulate API call
      setTimeout(() => {
        // For demo purposes, accept any email/password
        if (email && password) {
          localStorage.setItem("authToken", "demo-token-" + Date.now())
          localStorage.setItem("user", JSON.stringify({ email, name: "KhrossGh" }))
          this.isAuthenticatedSubject.next(true)
          observer.next(true)
        } else {
          observer.next(false)
        }
        observer.complete()
      }, 1500)
    })
  }

  logout(): void {
    localStorage.removeItem("authToken")
    localStorage.removeItem("user")
    sessionStorage.clear()
    this.isAuthenticatedSubject.next(false)
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value
  }
    */
}
