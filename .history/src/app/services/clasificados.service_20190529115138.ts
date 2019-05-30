import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class ClasificadosService {

  constructor(private db: AngularFireDatabase) { }

  getAnuncios() {
    return this.db.list('anuncios/bazar').valueChanges();
  }

  getEmpleos() {
    return this.db.list('anuncios/empleos').valueChanges();
  }

  getArticuloBazar(categoria, id) {
    return new Promise(async (resolve, reject) => {
      const bazarSub =  this.db.object(`/anuncios/bazar/${categoria}/${id}`).valueChanges()
        .subscribe(articulo => {
          bazarSub.unsubscribe();
          resolve(articulo);
        });
    });
  }

  getPreguntas(id) {
    return this.db.list(`/preguntas/${id}`).valueChanges();
}

}
