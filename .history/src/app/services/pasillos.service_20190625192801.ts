import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { VariablesService } from './variables.service';
import { UidService } from './uid.service';

@Injectable({
  providedIn: 'root'
})
export class PasillosService {

  public cart = new BehaviorSubject([]);
  carrito: any;
  total = 0;
  public cuenta = new BehaviorSubject(0);
  public cantidad = new BehaviorSubject(0);
  localProdsCart = [];

  uid = '';

  constructor(
    private db: AngularFireDatabase,
    private variableService: VariablesService,
    private uidService: UidService,
    private router: Router
  ) {
    this.uid = this.uidService.getUid();
  }

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

  async guardarProductoFavorito(id, categoria, producto) {
    return new Promise(async (resolve, reject) => {
      try {
        await this.db.object(`usuarios/${this.uid}/favoritos/productos/${id}/${categoria}/${producto.id}`).set(producto);
        resolve(true);
      } catch (error) {
        reject(error);
      }
    });
  }

  async getProductosFavoritos(id, categoria) {
    return new Promise(async (resolve, reject) => {
      try {
        const favSub = this.db.object(`usuarios/${this.uid}/favoritos/productos/${id}/${categoria}`).valueChanges()
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

  async borrarProductoFavorito(id, categoria, producto) {
    return new Promise(async (resolve, reject) => {
      try {
        await this.db.object(`usuarios/${this.uid}/favoritos/productos/${id}/${categoria}/${producto}`).remove();
        resolve(true);
      } catch (error) {
        reject(error);
      }
    });
  }

  async actualizaCarrito(id) {
    return new Promise(async (resolve, reject) => {
      try {
        const updatedCountData: any = {};
        updatedCountData[`usuarios/${this.uid}/carrito/${id}/productos`] = this.carrito;
        updatedCountData[`usuarios/${this.uid}/carrito/${id}/resumen/cuenta`] = this.total;
        updatedCountData[`usuarios/${this.uid}/carrito/${id}/resumen/cantidad`] = this.carrito.length;
        this.db.object('/').update(updatedCountData);
        resolve(true);
      } catch (error) {
        reject(error);
      }
    });
  }

  async getCart(id) {
    const cart: any = await this.getCartResumen(id);
    if (cart) {
      this.total = cart.cuenta;
      this.cuenta.next(cart.cuenta);
      this.cantidad.next(cart.cantidad);
      this.carrito = await this.getCartProds(id);
      if (this.carrito) {
        this.cart.next(this.carrito);
        this.localProdsCart = [...this.carrito];
      }
    }
    return;
  }

  async getCartResumen(id) {
    return new Promise(async (resolve, reject) => {
      try {
        const resSub = this.db.object(`usuarios/${this.uid}/carrito/${id}/resumen`).valueChanges()
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

  async getCartProds(id) {
    return new Promise(async (resolve, reject) => {
      try {
        const cartSub = this.db.list(`usuarios/${this.uid}/carrito/${id}/productos`)
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

  updateProductsQty(prods) {
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
    this.localProdsCart = this.localProdsCart.filter(x => x.use === false);
    return prods;
  }

  async addProduct(producto, i, id, y?) {
    if (!this.uid || this.uid === null) {
      this.variableService.setSave(true);
      this.variableService.setIndex(i, y);
      this.variableService.setPendientType('producto');
      this.router.navigate(['/login', 'menu', 'producto']);
      return;
    }
    if (this.carrito.length === 0) {
      await this.guardaProducto(producto, i, id, y);
      this.variableService.setSave(false);
      this.variableService.setIndex(null);
      return;
    }
    const index = this.carrito.findIndex(prod => prod.id === producto.id);
    if (index < 0) {
      await this.guardaProducto(producto, i, id, y);
      this.variableService.setSave(false);
      this.variableService.setIndex(null);
      this.variableService.setPendientType('');
      return;
    }
  }

  async guardaProducto(producto, i, id, y?) {
    producto.y = y;
    producto.index = i;
    producto.cantidad = 1;
    producto.total = producto.precio;
    this.carrito.push({...producto});
    this.total += producto.precio;
    await this.refreshCart(id);
    return;
  }

  async plusProduct(producto, id) {
    const index = this.carrito.findIndex(prod => prod.id === producto.id);
    this.carrito[index].cantidad += 1;
    this.carrito[index].total += producto.precio;
    this.total += producto.precio;
    await this.refreshCart(id);
    return;
  }

  clearCart(id) {
    this.carrito = [];
    this.total = 0;
    this.refreshCart(id);
  }

  async restProduct(producto, cantidad, id) {
    this.total -= producto.precio;
    const index = this.carrito.findIndex(prod => prod.id === producto.id);
    if (cantidad === 0) {
      this.carrito.splice(index, 1);
      await this.refreshCart(id);
      return;
    }
    this.carrito[index].cantidad -= 1;
    this.carrito[index].total -= producto.precio;
    await this.refreshCart(id);
    return;
  }

  async refreshCart(id) {
    this.cart.next(this.carrito);
    this.cuenta.next(this.total);
    this.cantidad.next(this.carrito.length);
    await this.actualizaCarrito(id);
    return;
  }






}
