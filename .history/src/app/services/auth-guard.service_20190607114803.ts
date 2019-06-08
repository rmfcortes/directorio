import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { UidService } from './uid.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(
    private router: Router,
    private uidServices: UidService,
    private auth: AuthService
    ) { }

  async canActivate() {
    const uid = this.uidServices.getUid();
    if (!uid) {
      const user: any = await this.auth.revisa();
      if (!user) {
        this.router.navigate(['/ofertas']);
        return false;
      }
      console.log(user.uid);
      this.uidServices.setUid(user.uid);
      return true;
    } else {
      return true;
    }
  }
}
