import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OfertasService {

  constructor(private db: AngularFireDatabase) {}

  getOfertas(batch, lastKey?) {
    if (lastKey) {
      return this.db.list('solo-lectura/ofertas', data =>
        data.orderByKey().limitToLast(batch).endAt(lastKey));
    } else {
      return this.db.list('solo-lectura/ofertas', data =>
        data.orderByKey().limitToLast(batch));
    }
  }

  getOfertasFiltradas(batch, categoria, lastKey?) {
    if (lastKey) {
      return this.db.list(`solo-lectura/ofertas-por-categoria/${categoria}`, data =>
        data.orderByKey().limitToLast(batch).endAt(lastKey));
    } else {
      return this.db.list(`solo-lectura/ofertas-por-categoria/${categoria}`, data =>
        data.orderByKey().limitToLast(batch));
    }
  }

  getOferta(id) {
    return new Promise((resolve, reject) => {
      const ofertasSub = this.db.object(`solo-lectura/ofertas-detalles/${id}`).valueChanges().subscribe(oferta => {
        ofertasSub.unsubscribe();
        if (oferta) {
          resolve(oferta);
        } else {
          resolve(false);
        }
      });
    });
  }

  getCatOfertas() {
    return new Promise((resolve, reject) => {
      const catOfSub = this.db.list(`solo-lectura/categorias-ofertas`).valueChanges().subscribe(categorias => {
        catOfSub.unsubscribe();
        console.log(categorias);
        if (categorias) {
          resolve(categorias);
        } else {
          resolve(false);
        }
      });
    });
  }

}