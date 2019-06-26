import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PasillosService {

  public cart = new BehaviorSubject([]);
  public cuenta = new BehaviorSubject(0);
  public cantidad = new BehaviorSubject(0);
  localProdsCart = [];

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

  async guardarProductoFavorito(uid, id, categoria, producto) {
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

  async addProductoCarrito(uid, id, carrito, cuenta) {
    return new Promise(async (resolve, reject) => {
      try {
        const updatedCountData: any = {};
        updatedCountData[`usuarios/${uid}/carrito/${id}/productos`] = carrito;
        updatedCountData[`usuarios/${uid}/carrito/${id}/resumen/cuenta`] = cuenta;
        updatedCountData[`usuarios/${uid}/carrito/${id}/resumen/cantidad`] = carrito.length;
        this.db.object('/').update(updatedCountData);
        resolve(true);
      } catch (error) {
        reject(error);
      }
    });
  }

  async getCartProds(uid, id) {
    return new Promise(async (resolve, reject) => {
      try {
        const cartSub = this.db.list(`usuarios/${uid}/carrito/${id}/productos`)
          .valueChanges().subscribe(prodsInCart => {
              cartSub.unsubscribe();
              if (prodsInCart) {
                resolve(prodsInCart);
              } else {
                resolve(false);
              }
            });
      } catch (error) {
        reject(error);
      }
    });
  }

  async getCartResumen(uid, id) {
    return new Promise(async (resolve, reject) => {
      try {
        const resSub = this.db.object(`usuarios/${uid}/carrito/${id}/resumen`).valueChanges()
          .subscribe(resumen => {
            resSub.unsubscribe();
            if (resumen) {
              resolve(resumen);
            } else {
              resolve(false);
            }
          });
      } catch (error) {
        reject(error);
      }
    });
  }

  async getCart(uid, id, prods, categoria?) {
    const cart: any = await this.getCartResumen(uid, id);
    console.log(prods);
    let prodsAndCart = prods;
    if (cart) {
      this.cuenta.next(cart.cuenta);
      this.cantidad.next(cart.cantidad);
      const carrito: any = await this.getCartProds(uid, id);
      if (carrito) {
        this.cart.next(carrito);
        if (categoria) {
          this.localProdsCart = carrito.filter(c => c.categoria === categoria);
        } else {
          this.localProdsCart = [...carrito];
        }
        prodsAndCart = await this.updateProductsQty(prods);
      }
    }
    console.log(prodsAndCart);
    return prodsAndCart;
  }

  updateProductsQty(prods, destacado?) {
    console.log('Update');
    this.localProdsCart.forEach((prod) => {
      const index = prods.findIndex(p => p.id === prod.id);
      if (index >= 0) {
        prods[index].cantidad = prod.cantidad;
        prods[index].index = prod.index;
        prods[index].cart = true;
        prod.use = true;
        return;
      }
      prod.use = false;
    });
    if (!destacado) { this.localProdsCart = this.localProdsCart.filter(x => x.use === false); }
    return prods;
  }

  setCart(cart) {
    this.cart = cart;
  }




}
