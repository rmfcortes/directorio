import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class AnunciosService {

  constructor(private db: AngularFireDatabase) { }

  publicarBazar(producto, uid) {
    return new Promise(async (resolve, reject) => {
      const id = this.db.createPushId();
      producto.id = id;
      producto.uid = uid;
      const updatedUserComent =  {};
      updatedUserComent[`usuarios/${uid}/anuncios/bazar/${id}`] = producto;
      updatedUserComent[`anuncios/bazar/${producto.categoria}/${id}`] = producto;
      await this.db.object(`/`).update(updatedUserComent);
      resolve(true);
    });
  }
}
