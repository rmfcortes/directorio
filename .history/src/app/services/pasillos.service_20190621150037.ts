import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class PasillosService {

  constructor(
    private db: AngularFireDatabase
  ) { }

  getCategorias(id, pasillo) {
    return new Promise((resolve, reject) => {
      const catSub = this.db.list(`solo-lectura/negocios/productos/todos/${id}/${pasillo}/categorias`).valueChanges()
        .subscribe(categorias => {
          catSub.unsubscribe();
          resolve(categorias);
        });
    });
  }

  getProductos(id, pasillo, categoria) {
    return new Promise((resolve, reject) => {
      const prodSub = this.db.list(`solo-lectura/negocios/productos/todos/${id}/${pasillo}/productos/${categoria}`,
        data => data.orderByKey().limitToFirst(20)).valueChanges()
          .subscribe(productos => {
            prodSub.unsubscribe();
            resolve(productos);
          });
    });
  }

}
