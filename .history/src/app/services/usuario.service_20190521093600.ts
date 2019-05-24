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
    const updatedUserComent =  {};
    updatedUserComent[`usuarios/${uid}/comentarios/${id}`] = comentario;
    updatedUserComent[`valoraciones/${id}/comentarios/${uid}`] = comentario;
    this.db.object(`/`).update(updatedUserComent);
  }
}