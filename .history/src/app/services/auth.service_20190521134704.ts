import { Injectable } from '@angular/core';
import { Facebook } from '@ionic-native/facebook/ngx';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(public facebook: Facebook,
              private gPlus: GooglePlus,
              private platform: Platform,
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
    return new Promise((resolve, reject) => {
      if (this.platform.is('cordova')) {
        resolve(this.nativeGoogleLogin());
      } else {
        resolve(this.webGoogleLogin());
      }
    });
  }

  async webGoogleLogin(){
    try {
      const provider = new auth.GoogleAuthProvider();
      const credential = await this.authFirebase.auth.signInWithPopup(provider);
      return credential;
    } catch (err) {
      console.log(err);
      return false;
    }

  }

  async nativeGoogleLogin() {
    try {
      const gplusUser = await this.gPlus.login({
        webClientId: '765159975436-pc92uulk4js00k82aqokgc0hnq5qmr80.apps.googleusercontent.com',
        offline: false,
        scopes: 'profile email'
      });
      console.log(gplusUser);

      return await this.authFirebase.auth.signInWithCredential(auth.GoogleAuthProvider.credential(gplusUser.idToken));

    } catch (err) {
      console.log(err);
      return false;
    }
  }

  revisa() {
    return new Promise ((resolve, reject) => {
      resolve(this.authFirebase.authState);
    });
  }

  revisaSub() {
    return this.authFirebase.authState;
  }

  logout() {
    this.authFirebase.auth.signOut();
  }

}
