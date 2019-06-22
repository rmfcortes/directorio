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
      const catSub = this.db.object(`solo-lectura/negocios/productos/todos/${id}/${pasillo}/categorias`).valueChanges()
        .subscribe(categorias => {
          catSub.unsubscribe();
          resolve(categorias);
        });
    });
  }

  getProductos(id, pasillo) {
    return new Promise((resolve, reject) => {
      const prodSub = this.db.object(`solo-lectura/negocios/productos/todos/${id}/${pasillo}/categorias`).valueChanges()
        .subscribe(productos => {
          prodSub.unsubscribe();
          resolve(productos);
        });
    });
  }

}
