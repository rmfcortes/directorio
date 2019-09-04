import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Pregunta, Pasillo, Producto, ResultNegocio,
         PrevDataNegocio, Comentarios, SubCategoria, Ofertas, VistaPreviaNegocio
        } from '../interfaces/negocio.interface';

@Injectable({
  providedIn: 'root'
})
export class NegociosService {

  temporal: PrevDataNegocio;

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

  getNegocios(categoria): Promise<VistaPreviaNegocio[]> {
    return new Promise((resolve, reject) => {
      const negSub = this.db.list(`solo-lectura/negocios/vista-previa/${categoria}/Todas`, data =>
        data.orderByChild('rate').limitToLast(10)).valueChanges().subscribe((negocios: VistaPreviaNegocio[]) => {
            negSub.unsubscribe();
            if (negocios) {
              resolve(negocios);
            } else {
              resolve(null);
            }
          });
    });
  }

  getSubCategorias(categoria): Promise<SubCategoria[]> {
    return new Promise((resolve, reject) => {
      const subSub = this.db.list(`solo-lectura/negocios/subCategorias/${categoria}`)
        .valueChanges().subscribe((subcategorias: SubCategoria[]) => {
          subSub.unsubscribe();
          if (subcategorias) {
            resolve(subcategorias);
          } else {
            resolve(null);
          }
        });
    });
  }

  getOfertasFiltradas(categoria): Promise<Ofertas[]> {
    return new Promise((resolve, reject) => {
      const ofSub = this.db.list(`solo-lectura/ofertas/oferta-por-categoria/${categoria}`, data =>
        data.orderByKey().limitToLast(10)).valueChanges().subscribe((ofertas: Ofertas[]) => {
          ofSub.unsubscribe();
          if (ofertas) {
            resolve(ofertas);
          } else {
            resolve(null);
          }
        });
    });
  }

  // Ficha Negocio

  getProductosDestacados(id): Promise<Producto[]> {
    return new Promise((resolve, reject) => {
      const prodSub = this.db.list(`solo-lectura/negocios/productos/muestra/${id}/destacados`)
        .valueChanges().subscribe((productos: Producto[]) => {
          prodSub.unsubscribe();
          resolve(productos);
        });
    });
  }

  getProductos(id, batch, lastKey?): Promise<Pasillo[]> {
    return new Promise((resolve, reject) => {
      if (lastKey) {
        const x = this.db.list(`solo-lectura/negocios/productos/muestra/${id}/pasillos`, data =>
          data.orderByKey().limitToFirst(batch).startAt(lastKey)).valueChanges().subscribe((productos: Pasillo[]) => {
            x.unsubscribe();
            resolve(productos);
          });
      } else {
        const x = this.db.list(`solo-lectura/negocios/productos/muestra/${id}/pasillos`, data =>
          data.orderByKey().limitToFirst(batch)).valueChanges().subscribe((productos: Pasillo[]) => {
            x.unsubscribe();
            resolve(productos);
          });
      }
    });
  }

  getProductosLista(id, pasillo, batch, lastKey?): Promise<Producto[]> {
    return new Promise((resolve, reject) => {
      if (lastKey) {
        const x = this.db.list(`solo-lectura/negocios/productos/todos/${id}/${pasillo}`, data =>
          data.orderByKey().limitToFirst(batch).startAt(lastKey)).valueChanges().subscribe((productos: Producto[]) => {
            x.unsubscribe();
            resolve(productos);
          });
      } else {
        const x = this.db.list(`solo-lectura/negocios/productos/todos/${id}/${pasillo}`, data =>
          data.orderByKey().limitToFirst(batch)).valueChanges().subscribe((productos: Producto[]) => {
            x.unsubscribe();
            resolve(productos);
          });
      }
    });
  }

  getPasillos(id): Promise<Array<string>> {
    return new Promise((resolve, reject) => {
      const pasSub = this.db.object(`solo-lectura/negocios/productos/pasillos/${id}`)
        .valueChanges().subscribe(pasillos => {
          pasSub.unsubscribe();
          const entries = Object.entries(pasillos);
          const sorted = entries.sort((a, b) => a[1] - b[1]);
          console.log(sorted);
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

  getSucursalNegocio(id, sucursal) {
    return new Promise((resolve, reject) => {
      const sucSub = this.db.object(`solo-lectura/negocios/info/${id}`)
        .valueChanges().subscribe(info => {
          sucSub.unsubscribe();
          resolve(info);
        });
    });
  }

  getNegocio(id): Promise<ResultNegocio> {
    return new Promise((resolve, reject) => {
      const negSub = this.db.object(`solo-lectura/negocios/detalle/${id}`)
        .valueChanges().subscribe((negocio: ResultNegocio) => {
          negSub.unsubscribe();
          resolve(negocio);
        });
    });
  }

  getOpinionesMuestra(id): Promise<Comentarios[]> {
    return new Promise((resolve, reject) => {
      const valSub = this.db.list(`solo-lectura/negocios/valoraciones/${id}/comentarios`, val => val.orderByKey().limitToLast(3))
        .valueChanges().subscribe((valoraciones: Comentarios[]) => {
          resolve(valoraciones);
          valSub.unsubscribe();
        }, (error) => {
          reject(error);
        });
    });
  }

  getOpiniones(id, batch, lastKey?): Promise<Comentarios[]> {
    return new Promise((resolve, reject) => {
      if (lastKey) {
        const x = this.db.list(`solo-lectura/negocios/valoraciones/${id}/comentarios`, data =>
          data.orderByChild('puntos').limitToLast(batch).startAt(lastKey))
            .valueChanges().subscribe((valoraciones: Comentarios[]) => {
              x.unsubscribe();
              resolve(valoraciones);
            });
      } else {
        const x = this.db.list(`solo-lectura/negocios/valoraciones/${id}/comentarios`, data =>
          data.orderByChild('puntos').limitToLast(batch)).valueChanges().subscribe((valoraciones: Comentarios[]) => {
            x.unsubscribe();
            resolve(valoraciones);
          });
      }
    });
  }

  setTemporal(negocio) {
    delete negocio.url;
    this.temporal = negocio;
  }

  getTemporal(): PrevDataNegocio {
    return this.temporal;
  }

}
