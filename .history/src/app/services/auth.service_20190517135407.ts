import { Injectable } from '@angular/core';
import { Facebook } from '@ionic-native/facebook/ngx';

import * as firebase from 'firebase/app';
import { FirebaseAuth } from '@angular/fire';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(public facebook: Facebook,
              public authFirebase: FirebaseAuth) { }

  facebookLogin(): Promise<any> {
    return this.facebook.login(['email'])
    .then( response => {
      const facebookCredential = firebase.auth.FacebookAuthProvider
        .credential(response.authResponse.accessToken);

      firebase.auth().signInWithCredential(facebookCredential)
        .then( success => {
          console.log('Firebase success: ' + JSON.stringify(success));
        });

    }).catch((error) => console.log(error));
  }

  loginGoogle() {
    return this.authFirebase.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }

  logout() {
    this.authFirebase.signOut();
  }

}

