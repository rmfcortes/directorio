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

  getUidAndPhoto() {
    return new Promise((resolve, reject) => {
      const userSub = this.authFirebase.authState.subscribe(info => {
        userSub.unsubscribe();
        console.log(info);
        const user = {
          uid: info.uid,
          url: info.photoURL,
          nombre: info.displayName
        };
        resolve(user);
      });
    });
  }

  async getCuenta() {
    return new Promise(async (resolve, reject) => {
      const uid = await this.getUid();
      const cuentaSub =  this.db.object(`usuarios/${uid}/cuenta`).valueChanges()
        .subscribe(comentarios => {
          cuentaSub.unsubscribe();
          resolve(comentarios);
        });
    });
  }

  getComentario(uid, id) {
    return this.db.object(`usuarios/${uid}/comentarios/${id}`).valueChanges();
  }

  async getComentarios() {
    return new Promise(async (resolve, reject) => {
      const uid = await this.getUid();
      const comentariosSub = this.db.list(`usuarios/${uid}/comentarios`).valueChanges()
        .subscribe(comentarios => {
          comentariosSub.unsubscribe();
          resolve(comentarios);
        });
    });
  }

  async guardarFavorito(negocio) {
    const uid = await this.getUid();
    return new Promise(async (resolve, reject) => {
      try {
        await this.db.object(`usuarios/${uid}/favoritos/${negocio.categoria}/${negocio.id}`).set(negocio);
        resolve(true);
      } catch (error) {
        reject(error);
      }
    });
  }

  async getFavorito(id, clasificado) {
    return new Promise(async (resolve, reject) => {
      try {
        const uid = await this.getUid();
        const favSub = this.db.object(`usuarios/${uid}/favoritos/${clasificado}/${id}`).valueChanges()
          .subscribe(isFavorito => {
            favSub.unsubscribe();
            if (isFavorito) {
              resolve(true);
            } else {
              resolve(false);
            }
          });
      } catch (error) {
        reject(error);
      }
    });
  }

  async borrarFavorito(id, clasificado) {
    const uid = await this.getUid();
    return new Promise(async (resolve, reject) => {
      try {
        await this.db.object(`usuarios/${uid}/favoritos/${clasificado}/${id}`).remove();
        resolve(true);
      } catch (error) {
        reject(error);
      }
    });
  }

  async getFavoritos() {
    return new Promise(async (resolve, reject) => {
      try {
        const uid = await this.getUid();
        const favSub = this.db.object(`usuarios/${uid}/favoritos`).valueChanges()
          .subscribe(favoritos => {
            favSub.unsubscribe();
            if (favoritos) {
              resolve(favoritos);
            } else {
              resolve(false);
            }
          });
      } catch (error) {
        reject(error);
      }
    });
  }

  async getListaFavoritos(categoria) {
    return new Promise(async (resolve, reject) => {
      try {
        const uid = await this.getUid();
        const favSub = this.db.list(`usuarios/${uid}/favoritos/${categoria}`).valueChanges()
          .subscribe((favoritos: any) => {
            favSub.unsubscribe();
            if (favoritos) {
              resolve(favoritos);
            } else {
              resolve(false);
            }
          });
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
      const cSub = this.db.object(`cuentas/${cuenta}`).valueChanges().subscribe((c: any) => {
        cSub.unsubscribe();
        resolve(c.anuncios);
      });
    });
  }

  async getAnuncios() {
    return new Promise(async (resolve, reject) => {
      const uid = await this.getUid();
      const anunciosSub = this.db.object(`usuarios/${uid}/anuncios`).valueChanges()
        .subscribe(comentarios => {
          anunciosSub.unsubscribe();
          resolve(comentarios);
        });
    });
  }

  publicarPregunta(pregunta) {
    return new Promise(async (resolve, reject) => {
      const user: any = await this.getUidAndPhoto();
      console.log(user);
      pregunta.id = this.db.createPushId();
      pregunta.url = user.url;
      pregunta.nombre = user.nombre;
      await this.db.object(`usuarios/${user.uid}/preguntas/${pregunta.categoria}/${pregunta.id}`).set(pregunta);
      resolve(true);
    });
  }

  async borrarPregunta(id, categoria) {
    const uid = await this.getUid();
    return new Promise(async (resolve, reject) => {
      try {
        await this.db.object(`usuarios/${uid}/preguntas/${categoria}/${id}`).remove();
        resolve(true);
      } catch (error) {
        reject(error);
      }
    });
  }

  async getPreguntas() {
    return new Promise(async (resolve, reject) => {
      const uid = await this.getUid();
      const preguntasSub = this.db.object(`usuarios/${uid}/preguntas`).valueChanges()
        .subscribe(preguntas => {
          preguntasSub.unsubscribe();
          resolve(preguntas);
        });
    });
  }


}