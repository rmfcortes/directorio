import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class OfertasService {

  constructor(private db: AngularFireDatabase) { }

  getOfertas() {
    return new Promise((resolve, reject) => {
      const ofertasSub = this.db.list(`ofertas`).valueChanges().subscribe(ofertas => {
        ofertasSub.unsubscribe();
        if (ofertas) {
          resolve(ofertas);
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
