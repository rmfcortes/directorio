import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OfertasService {

  constructor(private db: AngularFireDatabase) {}

  getOfertas(batch, lastKey?) {
    console.log(lastKey);
    if (lastKey) {
      return this.db.list('solo-lectura/ofertas', data =>
        data.orderByKey().limitToLast(batch).endAt(lastKey));
    } else {
      return this.db.list('solo-lectura/ofertas', data =>
        data.orderByKey().limitToLast(batch));
    }
  }

  getOfertasFiltradas(batch, categoria, lastKey?) {
    console.log(lastKey);
    console.log(categoria);
    if (lastKey) {
      return this.db.list('solo-lectura/ofertas', data =>
        data.orderByChild('categoria').startAt(categoria, lastKey).limitToLast(batch));
    } else {
      console.log('No lastKey');
      return this.db.list('solo-lectura/ofertas', data =>
        data.orderByChild('categoria').equalTo(categoria).limitToLast(batch));
    }
  }

  getCantidadOfertas() {
    return new Promise((resolve, reject) => {
      const ofertasSub = this.db.object('solo-lectura/cantidad-ofertas').valueChanges().subscribe(cantidad => {
        ofertasSub.unsubscribe();
        if (cantidad) {
          resolve(cantidad);
        } else {
          resolve(false);
        }
      });
    });
  }

  getOferta(id) {
    return new Promise((resolve, reject) => {
      const ofertasSub = this.db.object(`ofertas/${id}`).valueChanges().subscribe(oferta => {
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

  getOfertasDestacadas() {
    return this.db.list(`ofertas`, data => data.orderByChild('tipo').equalTo(1)).valueChanges();
  }

  getOfertasCategoria(categoria) {
    return this.db.list(`ofertas`, data => data.orderByChild('categoria').equalTo(categoria)).valueChanges();
  }


}
