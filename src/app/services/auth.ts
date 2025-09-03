import { Injectable } from "@angular/core"
import { BehaviorSubject, Observable } from "rxjs"

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasValidToken())
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable()

  constructor() {
    // Check authentication status on service initialization
    this.checkAuthStatus()
  }

  private hasValidToken(): boolean {
    const token = localStorage.getItem("authToken")
    return !!token
  }

  private checkAuthStatus(): void {
    const isAuth = this.hasValidToken()
    this.isAuthenticatedSubject.next(isAuth)
  }

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
}
