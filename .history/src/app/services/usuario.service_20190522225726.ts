import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private db: AngularFireDatabase,
              public authFirebase: AngularFireAuth) { }

  getUid() {
    return new Promise((resolve, reject) => {
      const userSub = this.authFirebase.authState.subscribe(user => {
        userSub.unsubscribe();
        resolve(user.uid);
      });
    });
  }

  async getCuenta() {
    const uid = await this.getUid();
    return this.db.object(`usuarios/${uid}/cuenta`).valueChanges();
  }

  getComentario(uid, id) {
    return this.db.object(`usuarios/${uid}/comentarios/${id}`).valueChanges();
  }

  async getComentarios() {
    const uid = await this.getUid();
    return this.db.object(`usuarios/${uid}/comentarios`).valueChanges();
  }

  async guardarFavorito(negocio) {
    const uid = await this.getUid();
    return new Promise(async (resolve, reject) => {
      try {
        await this.db.object(`usuarios/${uid}/favoritos/${negocio.id}`).set(negocio);
        resolve(true);
      } catch (error) {
        reject(error);
      }
    });
  }

  publicarComentario(comentario, uid) {
    console.log(comentario);
    return new Promise(async (resolve, reject) => {
      const updatedUserComent =  {};
      updatedUserComent[`usuarios/${uid}/comentarios/${comentario.id}`] = comentario;
      updatedUserComent[`valoraciones/${comentario.id}/comentarios/${uid}`] = comentario;
      await this.db.object(`/`).update(updatedUserComent);
      resolve(true);
    });
  }

  async borrarComentario(id) {
    const uid = await this.getUid();
    return new Promise(async (resolve, reject) => {
      try {
        await this.db.object(`valoraciones/${id}/comentarios/${uid}`).remove();
        await this.db.object(`usuarios/${uid}/comentarios/${id}`).remove();
        resolve(true);
      } catch (error) {
        reject(error);
      }
    });
  }

  getAnunciosPermitidos(cuenta) {
    return new Promise((resolve, reject) => {
      console.log(cuenta);
      const cSub = this.db.object(`cuentas/${cuenta}`).valueChanges().subscribe((c: any) => {
        cSub.unsubscribe();
        console.log(c);
        console.log(c.anuncios);
        resolve(c.anuncios);
      });
    });
  }

  async getAnuncios() {
    const uid = await this.getUid();
    return this.db.object(`usuarios/${uid}/anuncios`).valueChanges();
  }
}
