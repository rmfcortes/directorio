import { Injectable } from '@angular/core';
import { Facebook } from '@ionic-native/facebook/ngx';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { Storage } from '@ionic/storage';
import { Platform } from '@ionic/angular';
import { UidService } from './uid.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(public facebook: Facebook,
              private gPlus: GooglePlus,
              private platform: Platform,
              private storage: Storage,
              public authFirebase: AngularFireAuth,
              private uidService: UidService) { }

  facebookLogin(): Promise<any> {
    return this.facebook.login(['email'])
    .then( response => {
      const facebookCredential = auth.FacebookAuthProvider.credential(response.authResponse.accessToken);

      this.authFirebase.auth.signInWithCredential(facebookCredential)
        .then( success => {
          const usuario =  {
            nombre: success.user.displayName,
            foto: success.user.photoURL,
            uid: success.user.uid
          };
          console.log(usuario);
          this.guardaUsuarioStorage(usuario);
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
      const usuario =  {
        nombre: credential.user.displayName,
        foto: credential.user.photoURL,
        uid: credential.user.uid
      };
      console.log(usuario);
      this.guardaUsuarioStorage(usuario);
      return true;
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

      const credential = await this.authFirebase.auth.signInWithCredential(auth.GoogleAuthProvider.credential(gplusUser.idToken));
      const usuario =  {
        nombre: credential.user.displayName,
        foto: credential.user.photoURL,
        uid: credential.user.uid
      };
      console.log(usuario);
      this.guardaUsuarioStorage(usuario);
      return true;
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
        const u =  {
          nombre: usuario.nombre,
          uid: user.uid
        };
        console.log(usuario);
        this.guardaUsuarioStorage(u);
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

  async loginWithEmail(email, pass) {
    await this.authFirebase.auth.signInWithEmailAndPassword(email, pass);
    const user = this.authFirebase.auth.currentUser;
    const u =  {
      nombre: user.displayName,
      uid: user.uid
    };
    this.guardaUsuarioStorage(u);
  }

  revisa() {
    return new Promise (async (resolve, reject) => {
      if ( this.platform.is('cordova') ) {
        // Celular
        await this.storage.ready();
        const usuario = await this.storage.get('usuario');
        if ( usuario ) {
          this.uidService.setUser(JSON.parse(usuario));
          this.uidService.setUid(usuario.uid);
          resolve();
        } else {
          resolve(false);
        }
      } else {
        // Escritorio
        if ( localStorage.getItem('usuario') ) {
          const usuario = await JSON.parse(localStorage.getItem('usuario'));
          this.uidService.setUser(usuario);
          this.uidService.setUid(usuario.uid);
          resolve();
        } else {
          resolve(false);
        }
      }
    });
  }

  async revisaFireAuth() {
    return new Promise((resolve, reject) => {
      const authSub = this.authFirebase.authState.subscribe(user => {
        authSub.unsubscribe();
        if (user) {
          const usuario =  {
            nombre: user.displayName,
            foto: user.photoURL,
            uid: user.uid
          };
          this.guardaUsuarioStorage(usuario);
          resolve(true); }
      });
    });
  }

  revisaSub() {
    return this.authFirebase.authState;
  }

  guardaUsuarioStorage(usuario) {
    return new Promise (async (resolve, reject) => {
      if ( this.platform.is('cordova') ) {
        // Celular
        await this.storage.ready();
        this.storage.set('usuario', JSON.stringify(usuario));
        this.uidService.setUser(usuario);
        this.uidService.setUid(usuario.uid);
        resolve();
      } else {
        // Escritorio
        localStorage.setItem('usuario', JSON.stringify(usuario));
        this.uidService.setUser(usuario);
        this.uidService.setUid(usuario.uid);
        resolve();
      }
    });
  }

  logout() {
    this.authFirebase.auth.signOut();
    if ( this.platform.is('cordova') ) {
      this.storage.remove('usuario');
      this.uidService.setUser('inactivo');
      this.uidService.setUid(null);
    } else {
      localStorage.removeItem('usuario');
      this.uidService.setUser('inactivo');
      this.uidService.setUid(null);
    }
  }

}

