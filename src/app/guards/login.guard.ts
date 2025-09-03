import { Injectable } from "@angular/core"
import  { CanActivate, Router } from "@angular/router"
import { AuthService } from "../services/auth"
@Injectable({
  providedIn: "root",
})
export class LoginGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  canActivate(): boolean {
    console.log("LoginGuard: Checking if user is authenticated")
    if (this.authService.isAuthenticated()) {
      this.router.navigate(["/chat"])
      return false
    } else {
      return true
    }
  }
}
