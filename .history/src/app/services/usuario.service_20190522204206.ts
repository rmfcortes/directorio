import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private db: AngularFireDatabase) { }

  getComentario(uid, id) {
    return this.db.object(`usuarios/${uid}/comentarios/${id}`).valueChanges();
  }

  getComentarios(uid) {
    return this.db.object(`usuarios/${uid}/comentarios`).valueChanges();
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

  getCuenta(uid) {
    return this.db.object(`usuarios/${uid}/cuenta`).valueChanges();
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

  getAnuncios(uid) {
    return this.db.object(`usuarios/${uid}/anuncios`).valueChanges();
  }
}
