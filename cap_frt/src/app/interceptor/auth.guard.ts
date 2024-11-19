import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../login/login.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  constructor(private authService: LoginService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.isLoggedIn()) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}