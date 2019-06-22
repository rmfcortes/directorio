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

  getProductos(id, pasillo, categoria, batch, lastKey?) {
    return new Promise((resolve, reject) => {
      if (lastKey) {
        const x = this.db.list(`solo-lectura/negocios/productos/todos/${id}/${pasillo}/productos/${categoria}`, data =>
          data.orderByKey().limitToFirst(batch).startAt(lastKey)).valueChanges().subscribe(productos => {
            x.unsubscribe();
            console.log(productos);
            resolve(productos);
          });
      } else {
        const x = this.db.list(`solo-lectura/negocios/productos/todos/${id}/${pasillo}/productos/${categoria}`, data =>
          data.orderByKey().limitToFirst(batch)).valueChanges().subscribe(productos => {
            x.unsubscribe();
            resolve(productos);
          });
      }
    });
  }

}
