import { Injectable } from '@angular/core';
import { Facebook } from '@ionic-native/facebook/ngx';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(public facebook: Facebook,
              private gPlus: GooglePlus,
              public authFirebase: AngularFireAuth) { }

  facebookLogin(): Promise<any> {
    return this.facebook.login(['email'])
    .then( response => {
      const facebookCredential = auth.FacebookAuthProvider.credential(response.authResponse.accessToken);

      this.authFirebase.auth.signInWithCredential(facebookCredential)
        .then( success => {
          console.log(success);
        });

    }).catch((error) => console.log('Error:' + error));
  }

  async loginGoogle() {
    try {

      const gplusUser = await this.gPlus.login({
        webClientId: '765159975436-a5ehtihvrlgqo1igfgutap03jk3jgpv5.apps.googleusercontent.com',
        offline: true,
        scopes: 'profile email'
      });

      return await this.authFirebase.auth.signInWithCredential(auth.GoogleAuthProvider.credential(gplusUser.idToken));

    } catch (err) {
      console.log(err);
    }
  }

  revisa() {
    return this.authFirebase.authState;
  }

  logout() {
    this.authFirebase.auth.signOut();
  }

}

