import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Pregunta } from '../interfaces/negocio.interface';

@Injectable({
  providedIn: 'root'
})
export class NegociosService {

  temporal = {};

  constructor(private db: AngularFireDatabase) { }

  // Lista Negocios

  getCategoriasNegocios() {
    return new Promise((resolve, reject) => {
      const catOfSub = this.db.list(`solo-lectura/negocios/categorias-publicadas`).valueChanges().subscribe(categorias => {
        catOfSub.unsubscribe();
        if (categorias) {
          resolve(categorias);
        } else {
          resolve(false);
        }
      });
    });
  }

  getNegocios(categoria) {
    return new Promise((resolve, reject) => {
      const negSub = this.db.list(`solo-lectura/negocios/vista-previa/${categoria}/Todas`, data =>
        data.orderByChild('rate').limitToLast(10)).valueChanges().subscribe(negocios => {
            negSub.unsubscribe();
            if (negocios) {
              resolve(negocios);
            } else {
              resolve(false);
            }
          });
    });
  }

  getSubCategorias(categoria) {
    return new Promise((resolve, reject) => {
      const subSub = this.db.list(`solo-lectura/negocios/subCategorias/${categoria}`).valueChanges().subscribe(subcategorias => {
        subSub.unsubscribe();
        if (subcategorias) {
          resolve(subcategorias);
        } else {
          resolve(false);
        }
      });
    });
  }

  getOfertasFiltradas(categoria) {
    return new Promise((resolve, reject) => {
      const ofSub = this.db.list(`solo-lectura/ofertas/oferta-por-categoria/${categoria}`, data =>
        data.orderByKey().limitToLast(10)).valueChanges().subscribe(ofertas => {
          ofSub.unsubscribe();
          resolve(ofertas);
        });
    });
  }

  // Ficha Negocio

  getProductosDestacados(id) {
    return new Promise((resolve, reject) => {
      const prodSub = this.db.list(`solo-lectura/negocios/productos/muestra/${id}/destacados`)
        .valueChanges().subscribe(productos => {
          prodSub.unsubscribe();
          resolve(productos);
        });
    });
  }

  getProductos(id, batch, lastKey?) {
    return new Promise((resolve, reject) => {
      if (lastKey) {
        const x = this.db.list(`solo-lectura/negocios/productos/muestra/${id}/pasillos`, data =>
          data.orderByKey().limitToFirst(batch).startAt(lastKey)).valueChanges().subscribe(productos => {
            x.unsubscribe();
            resolve(productos);
          });
      } else {
        const x = this.db.list(`solo-lectura/negocios/productos/muestra/${id}/pasillos`, data =>
          data.orderByKey().limitToFirst(batch)).valueChanges().subscribe(productos => {
            x.unsubscribe();
            resolve(productos);
          });
      }
    });
  }

  getPasillos(id) {
    return new Promise((resolve, reject) => {
      const pasSub = this.db.object(`solo-lectura/negocios/productos/muestra/${id}/nombre-pasillos`)
        .valueChanges().subscribe(pasillos => {
          pasSub.unsubscribe();
          resolve(Object.keys(pasillos));
        });
    });
  }

  getOfertasNegocio(id) {
    return new Promise((resolve, reject) => {
      const prodSub = this.db.list(`solo-lectura/ofertas/ofertas-por-negocio/${id}`)
        .valueChanges().subscribe(productos => {
          prodSub.unsubscribe();
          resolve(productos);
        });
    });
  }

  getPreguntasNegocio(id) {
    return new Promise((resolve, reject) => {
      const askSub = this.db.list(`solo-lectura/preguntas/${id}`, data => data.orderByKey().limitToLast(3))
        .valueChanges().subscribe((preguntas: Pregunta[]) => {
          askSub.unsubscribe();
          resolve(preguntas);
        });
    });
  }

  getSucursalNegocio(id, sucursal) {
    return new Promise((resolve, reject) => {
      const sucSub = this.db.object(`solo-lectura/negocios/sucursales/${id}/${sucursal}`)
        .valueChanges().subscribe(productos => {
          sucSub.unsubscribe();
          resolve(productos);
        });
    });
  }

  getNegocio(id) {
    return new Promise((resolve, reject) => {
      const negSub = this.db.object(`solo-lectura/negocios/detalle/${id}`)
        .valueChanges().subscribe(negocio => {
          negSub.unsubscribe();
          resolve(negocio);
        });
    });
  }

  getValoraciones(id) {
    return this.db.object(`solo-lectura/negocios/valoraciones/${id}`).valueChanges();
  }

  setTemporal(negocio) {
    delete negocio.url;
    this.temporal = negocio;
  }

  getTemporal() {
    return this.temporal;
  }

}