import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private router: Router,
              private auth: AuthService) { }

  canActivate(): boolean {
    this.auth.revisa().then(resp => {
      console.log(resp);
    });
    // this.router.navigate(['/login']);
    return true;
  }
}
