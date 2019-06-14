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
              private storage: Storage,
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

  async webGoogleLogin() {
    try {
      const provider = new auth.GoogleAuthProvider();
      const credential = await this.authFirebase.auth.signInWithPopup(provider);
      console.log(credential);
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

  async registraUsuario(usuario) {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await this.authFirebase.auth.createUserWithEmailAndPassword(usuario.correo, usuario.pass);
        if (!res) { return; }
        await this.authFirebase.auth.signInWithEmailAndPassword(usuario.correo, usuario.pass);
        const user = this.authFirebase.auth.currentUser;
        await user.updateProfile({displayName: usuario.nombre});
        resolve(true);
      } catch (err) {
        if (err.code === 'auth/email-already-in-use') {
          reject('Este correo ya está registrado. Intenta con otro');
        } else {
          reject('Error al registrar. Intenta de nuevo');
        }
      }
    });
  }

  loginWithEmail(email, pass) {
    return this.authFirebase.auth.signInWithEmailAndPassword(email, pass);
  }

  revisa() {
    return new Promise (async (resolve, reject) => {
      if ( this.platform.is('cordova') ) {
        //Celular
        await this.storage.ready();
        const usuario = await this.storage.get('usuario');
        if ( usuario ) {
          resolve(JSON.parse(usuario));
        } else {
          resolve(false);
        }
      } else {
        // Escritorio
        if ( localStorage.getItem('clientes') ) {
          resolve(JSON.parse(localStorage.getItem('clientes')));
        } else {
          resolve(false);
        }
      }
    });
  }

  revisaSub() {
    return this.authFirebase.authState;
  }

  logout() {
    this.authFirebase.auth.signOut();
  }

}
