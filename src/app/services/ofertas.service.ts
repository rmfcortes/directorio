import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { BehaviorSubject, Observable } from 'rxjs';
import { VistaPreviaNegocio } from 'src/app/interfaces/negocio.interface';

@Injectable({
  providedIn: 'root'
})
export class OfertasService {

  constructor(private db: AngularFireDatabase) {}

  getOfertas(batch, lastKey?) {
    if (lastKey) {
      return this.db.list('solo-lectura/ofertas/vista-previa', data =>
        data.orderByKey().limitToLast(batch).endAt(lastKey));
    } else {
      return this.db.list('solo-lectura/ofertas/vista-previa', data =>
        data.orderByKey().limitToLast(batch));
    }
  }

  getOfertasFiltradas(batch, categoria, lastKey?) {
    if (lastKey) {
      return this.db.list(`solo-lectura/ofertas/oferta-por-categoria/${categoria}`, data =>
        data.orderByKey().limitToLast(batch).endAt(lastKey));
    } else {
      return this.db.list(`solo-lectura/ofertas/oferta-por-categoria/${categoria}`, data =>
        data.orderByKey().limitToLast(batch));
    }
  }

  getOferta(id) {
    return new Promise((resolve, reject) => {
      const ofertasSub = this.db.object(`solo-lectura/ofertas/ofertas-detalles/${id}`).valueChanges().subscribe(oferta => {
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
      const catOfSub = this.db.object(`solo-lectura/ofertas/categorias-ofertas`).valueChanges().subscribe(categorias => {
        catOfSub.unsubscribe();
        if (categorias) {
          resolve(Object.keys(categorias));
        } else {
          resolve(false);
        }
      });
    });
  }

  getInfoNegocio(id, categoria): Promise<VistaPreviaNegocio> {
    return new Promise((resolve, reject) => {
      const negSub = this.db.object(`solo-lectura/negocios/vista-previa/${categoria}/Todas/${id}`).valueChanges()
        .subscribe((negocio: VistaPreviaNegocio) => {
          negSub.unsubscribe();
          if (negocio) {
            resolve(negocio);
          } else {
            resolve(null);
          }
        });
    });
  }

}
