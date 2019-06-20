import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class NegociosService {

  constructor(private db: AngularFireDatabase) { }

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
      const negSub = this.db.list(`solo-lectura/negocios/vista-previa`).valueChanges().subscribe(negocios => {
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
    return this.db.list(`solo-lectura/ofertas/oferta-por-categoria/${categoria}`, data =>
      data.orderByKey().limitToLast(10));
  }

  getNegocio(id) {
    return this.db.object(`negocios/${id}`).valueChanges();
  }

  getValoraciones(id) {
    return this.db.object(`valoraciones/${id}`).valueChanges();
  }
}
