import { Injectable } from '@angular/core';
import { Facebook } from '@ionic-native/facebook/ngx';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(public facebook: Facebook,
              public authFirebase: AngularFireAuth) { }

  facebookLogin(): Promise<any> {
    return this.facebook.login(['email'])
    .then( response => {
      const facebookCredential = auth.FacebookAuthProvider.credential(response.authResponse.accessToken);

      this.authFirebase.auth.signInWithCredential(facebookCredential)
        .then( success => {
          console.log('Firebase success: ' + JSON.stringify(success));
        });

    }).catch((error) => console.log('Error:' + error));
  }

  loginGoogle() {
    return this.authFirebase.auth.signInWithPopup(new auth.GoogleAuthProvider());
  }

  revisa() {
    return this.authFirebase.authState;
  }

  logout() {
    this.authFirebase.auth.signOut();
  }

}

