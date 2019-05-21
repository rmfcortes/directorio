import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private router: Router,
              private auth: AuthService) { }

  async canActivate() {
    const user = await this.auth.revisa();
    if (!user) {
      this.router.navigate(['/ofertas']);
      return false;
    }
    // this.router.navigate(['/login']);
    return true;
  }
}
