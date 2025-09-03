import { AuthService } from '../services/auth';
import { Injectable } from "@angular/core"
import  { CanActivate, Router } from "@angular/router"

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  canActivate(): boolean {
    console.log("AuthGuard: Checking if user is authenticated")
    if (this.authService.isAuthenticated()) {
      return true
    } else {
      this.router.navigate(["/login"])
      return false
    }
  }
}
