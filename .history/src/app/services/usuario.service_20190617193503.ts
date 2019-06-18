import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
import { UidService } from './uid.service';
import { async } from '@angular/core/testing';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private db: AngularFireDatabase,
              public authFirebase: AngularFireAuth,
              private uidService: UidService) { }

  getUid() {
    return new Promise((resolve, reject) => {
      const userSub = this.authFirebase.authState.subscribe(user => {
        userSub.unsubscribe();
        resolve(user.uid);
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

  async guardarOfertaFavorita(oferta) {
    const uid = await this.uidService.getUid();
    return new Promise(async (resolve, reject) => {
      try {
        await this.db.object(`usuarios/${uid}/favoritos/ofertas/${oferta.id}`).set(oferta);
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

  async borrarOfertaFavorita(id) {
    const uid = await this.uidService.getUid();
    return new Promise(async (resolve, reject) => {
      try {
        await this.db.object(`usuarios/${uid}/favoritos/ofertas/${id}`).remove();
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

  publicarComentario(comentario, uid) {
    console.log(comentario);
    return new Promise(async (resolve, reject) => {
      await this.db.object(`usuarios/${uid}/comentarios/${comentario.id}`).update(comentario);
      resolve(true);
    });
  }

  async borrarComentario(id) {
    const uid = await this.getUid();
    return new Promise(async (resolve, reject) => {
      try {
        await this.db.object(`usuarios/${uid}/comentarios/${id}`).remove();
        resolve(true);
      } catch (error) {
        reject(error);
      }
    });
  }

  async getAnunciosPermitidos() {
    return new Promise(async (resolve, reject) => {
      const uid = await this.uidService.getUid();
      const cSub = this.db.object(`usuarios/${uid}/permitidos`).valueChanges().subscribe((c: any) => {
        cSub.unsubscribe();
        resolve(c);
      });
    });
  }

  async getAnunciosPublicados() {
    return new Promise(async (resolve, reject) => {
      const uid = await this.uidService.getUid();
      const pubSub = this.db.object(`usuarios/${uid}/anuncios/cantidad`).valueChanges().subscribe(cuenta => {
        pubSub.unsubscribe();
        resolve(cuenta);
      });
    });
  }

  async getNegocios() {
    return new Promise(async (resolve, reject) => {
      const uid = await this.uidService.getUid();
      const anunciosSub = this.db.list(`usuarios/${uid}/anuncios/negocios`).valueChanges()
        .subscribe(negocios => {
          anunciosSub.unsubscribe();
          resolve(negocios);
        });
    });
  }

  async getOfertas() {
    return new Promise(async (resolve, reject) => {
      const uid = await this.uidService.getUid();
      const anunciosSub = this.db.list(`usuarios/${uid}/anuncios/ofertas`).valueChanges()
        .subscribe(ofertas => {
          anunciosSub.unsubscribe();
          resolve(ofertas);
        });
    });
  }

  async getAnunciosCategoria(categoria) {
    return new Promise(async (resolve, reject) => {
      const uid = await this.uidService.getUid();
      const anunciosSub = this.db.list(`usuarios/${uid}/anuncios/${categoria}`).valueChanges()
        .subscribe(anuncios => {
          anunciosSub.unsubscribe();
          resolve(anuncios);
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

  /* publicarPregunta(pregunta) {
    return new Promise(async (resolve, reject) => {
      // const user: any = await this.getUidAndPhoto(); GET FROM STORAGE
      console.log(user);
      pregunta.id = this.db.createPushId();
      pregunta.url = user.url;
      pregunta.nombre = user.nombre;
      await this.db.object(`usuarios/${user.uid}/preguntas/${pregunta.categoria}/${pregunta.id}`).set(pregunta);
      resolve(true);
    });
  } */

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

  getCuenta() {

  }

  publicarPregunta() {

  }

  getUidAndPhoto() {
    
  }


}
 