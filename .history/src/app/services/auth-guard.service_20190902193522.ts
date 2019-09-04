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
    const uid = await this.uidServices.getUid();
    console.log(uid);
    if (!uid) {
      const user: any = await this.auth.revisaFireAuth();
      if (!user) {
        this.router.navigate(['/login']);
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
