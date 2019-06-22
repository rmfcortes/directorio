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

  async guardarProductoFavorito(uid, id, producto, categoria) {
    return new Promise(async (resolve, reject) => {
      try {
        await this.db.object(`usuarios/${uid}/favoritos/productos/${id}/${categoria}/${producto.id}`).set(producto);
        resolve(true);
      } catch (error) {
        reject(error);
      }
    });
  }

  async getProductosFavoritos(uid, id, categoria) {
    return new Promise(async (resolve, reject) => {
      try {
        const favSub = this.db.object(`usuarios/${uid}/favoritos/productos/${id}/${categoria}`).valueChanges()
          .subscribe(favoritos => {
            favSub.unsubscribe();
            if (favoritos) {
              resolve(favoritos);
            } else {
              resolve(false);
            }
          });
      } catch (error) {
        reject(error);
      }
    });
  }

  async borrarProductoFavorito(uid, id, categoria, producto) {
    return new Promise(async (resolve, reject) => {
      try {
        await this.db.object(`usuarios/${uid}/favoritos/productos/${id}/${categoria}/${producto}`).remove();
        resolve(true);
      } catch (error) {
        reject(error);
      }
    });
  }

}
