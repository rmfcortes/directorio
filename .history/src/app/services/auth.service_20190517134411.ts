import { Injectable } from '@angular/core';
import { Facebook } from '@ionic-native/facebook/ngx';
import * as firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(public facebook: Facebook) { }

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
}
