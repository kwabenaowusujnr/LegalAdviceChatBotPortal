import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import {
  ServiceProxy,
  UserLoginInputDto,
  AuthResponse,
  UserRegistrationInputDto,
} from './api-client';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(
    this.hasValidToken()
  );
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  private tokenExpirationCheckInterval: any;
  private readonly CHECK_INTERVAL = 30000; // Check every 30 seconds

  constructor(
    private apiClient: ServiceProxy,
    private router: Router,
    private toastService: ToastService
  ) {
    // Check authentication status on service initialization
    this.checkAuthStatus();
    // Start monitoring token expiration if user is authenticated
    if (this.hasValidToken()) {
      this.startTokenExpirationMonitor();
    }
  }

  private hasValidToken(): boolean {
    const token = localStorage.getItem('authToken');
    if (!token) {
      return false;
    }

    // Check if token is expired
    if (this.isTokenExpired()) {
      return false;
    }

    return true;
  }

  private checkAuthStatus(): void {
    const isAuth = this.hasValidToken();
    this.isAuthenticatedSubject.next(isAuth);
  }

  public isTokenExpired(): boolean {
    const expiresAtStr = localStorage.getItem('tokenExpiresAt');
    if (!expiresAtStr) {
      return false; // If no expiration date, assume token doesn't expire
    }

    try {
      const expiresAt = new Date(expiresAtStr);
      const now = new Date();
      return now >= expiresAt;
    } catch (error) {
      console.error('Error parsing token expiration date:', error);
      return true; // If we can't parse the date, consider it expired
    }
  }

  private startTokenExpirationMonitor(): void {
    // Clear any existing interval
    this.stopTokenExpirationMonitor();

    // Check immediately
    if (this.isTokenExpired()) {
      this.handleTokenExpiration();
      return;
    }

    // Set up periodic checking
    this.tokenExpirationCheckInterval = setInterval(() => {
      if (this.isTokenExpired()) {
        this.handleTokenExpiration();
      }
    }, this.CHECK_INTERVAL);

    // Also set a timeout for the exact expiration time if available
    const expiresAtStr = localStorage.getItem('tokenExpiresAt');
    if (expiresAtStr) {
      try {
        const expiresAt = new Date(expiresAtStr);
        const now = new Date();
        const timeUntilExpiration = expiresAt.getTime() - now.getTime();

        if (timeUntilExpiration > 0) {
          setTimeout(() => {
            if (this.isTokenExpired()) {
              this.handleTokenExpiration();
            }
          }, timeUntilExpiration);
        }
      } catch (error) {
        console.error('Error setting up expiration timeout:', error);
      }
    }
  }

  private stopTokenExpirationMonitor(): void {
    if (this.tokenExpirationCheckInterval) {
      clearInterval(this.tokenExpirationCheckInterval);
      this.tokenExpirationCheckInterval = null;
    }
  }

  private handleTokenExpiration(): void {
    // Stop monitoring
    this.stopTokenExpirationMonitor();

    // Clear auth data
    localStorage.removeItem('authToken');
    localStorage.removeItem('tokenExpiresAt');
    localStorage.removeItem('user');
    sessionStorage.clear();

    // Update authentication state
    this.isAuthenticatedSubject.next(false);

    // Show notification
    this.toastService.warning(
      'Your session has expired. Please log in again.',
      'Session Expired',
      7000
    );

    // Navigate to login page
    this.router.navigate(['/login']);
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

          // Start monitoring token expiration
          this.startTokenExpirationMonitor();

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

          // Start monitoring token expiration
          this.startTokenExpirationMonitor();

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

  logout(): Observable<boolean> {
    // Stop monitoring token expiration
    this.stopTokenExpirationMonitor();

    localStorage.removeItem('authToken');
    localStorage.removeItem('tokenExpiresAt');
    localStorage.removeItem('user');
    sessionStorage.clear();
    this.isAuthenticatedSubject.next(false);

    return of(true);
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
