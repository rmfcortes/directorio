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

  publicarComentario(comentario, uid, id) {
    return new Promise(async (resolve, reject) => {
      const updatedUserComent =  {};
      updatedUserComent[`usuarios/${uid}/comentarios/${id}`] = comentario;
      updatedUserComent[`valoraciones/${id}/comentarios/${uid}`] = comentario;
      await this.db.object(`/`).update(updatedUserComent);
      resolve(true);
    });
  }

  getCuenta(uid) {
    return this.db.object(`usuarios/${uid}/cuenta`).valueChanges();
  }

  getCuentas() {
    return this.db.object(`cuentas`).valueChanges();
  }

  getAnuncios(uid) {
    return this.db.object(`usuarios/${uid}/anuncios`).valueChanges();
  }
}
