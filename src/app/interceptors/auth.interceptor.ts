import { HttpEvent, HttpHandler, HttpInterceptor, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../services/auth';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { ToastService } from '../services/toast.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authToken = this.authService.getAuthToken();

    if (authToken) {
      // Check if token is expired before making the request
      if (this.authService.isTokenExpired()) {
        // Token is expired, logout the user
        this.authService.logout().subscribe(() => {
          this.toastService.warning(
            'Your session has expired. Please log in again.',
            'Session Expired',
            7000
          );
          this.router.navigate(['/login']);
        });

        // Don't add the expired token to the request
        return next.handle(req);
      }

      // Token is valid, add it to the request
      const authReq = req.clone({
        headers: req.headers.set("Authorization", `Bearer ${authToken}`),
      });
      return next.handle(authReq);
    }

    return next.handle(req);
  }
}
