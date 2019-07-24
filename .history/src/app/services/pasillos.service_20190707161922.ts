import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { BehaviorSubject } from 'rxjs';
import { UidService } from './uid.service';
import { Producto, CategoriasPasillo } from '../interfaces/negocio.interface';

@Injectable({
  providedIn: 'root'
})
export class PasillosService {

  public cart = new BehaviorSubject([]);
  carrito = [];
  total = 0;
  public cuenta = new BehaviorSubject(0);
  public cantidad = new BehaviorSubject(0);
  localProdsCart = [];
  localFavs = [];
  favs = [];

  uid = '';

  constructor(
    private db: AngularFireDatabase,
    private uidService: UidService,
  ) {
    this.uid = this.uidService.getUid();
  }

  setUid() {
    this.uid = this.uidService.getUid();
  }

  getCategorias(id, pasillo): Promise<CategoriasPasillo[]> {
    return new Promise((resolve, reject) => {
      const catSub = this.db.list(`solo-lectura/negocios/productos/todos/${id}/${pasillo}/categorias`).valueChanges()
        .subscribe((categorias: CategoriasPasillo[]) => {
          catSub.unsubscribe();
          resolve(categorias);
        });
    });
  }

  getProductos(id, pasillo, categoria, batch, lastKey?): Promise<Producto[]> {
    return new Promise((resolve, reject) => {
      if (lastKey) {
        const x = this.db.list(
          `solo-lectura/negocios/productos/todos/${id}/${pasillo}/productos/${categoria}`, data =>
          data.orderByKey().limitToFirst(batch).startAt(lastKey))
          .valueChanges().subscribe((productos: Producto[]) => {
            x.unsubscribe();
            resolve(productos);
          });
      } else {
        const x = this.db.list(`solo-lectura/negocios/productos/todos/${id}/${pasillo}/productos/${categoria}`, data =>
          data.orderByKey().limitToFirst(batch)).valueChanges().subscribe((productos: Producto[]) => {
            x.unsubscribe();
            resolve(productos);
          });
      }
    });
  }

  async guardarProductoFavorito(id, categoria, producto) {
    return new Promise(async (resolve, reject) => {
      try {
        const updatedCountData: any = {};
        const fav = {
          id: producto.id,
          categoria: producto.categoria,
          pasillo: producto.pasillo,
          use: false,
        };
        console.log(producto);
        console.log(fav);
        updatedCountData[`usuarios/${this.uid}/favoritos/productos/todos/${id}/${categoria}/${producto.id}`] = producto;
        updatedCountData[`usuarios/${this.uid}/favoritos/productos/por-negocio/${id}/${producto.id}`] = fav;
        await this.db.object('/').update(updatedCountData);
        this.favs.push(fav);
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

  async getAllProductosFavoritos(id) {
    return new Promise(async (resolve, reject) => {
      try {
        const favSub = this.db.list(`usuarios/${this.uid}/favoritos/productos/por-negocio/${id}`).valueChanges()
          .subscribe(favoritos => {
            favSub.unsubscribe();
            if (favoritos) {
              this.favs = favoritos;
              this.localFavs = [...favoritos];
              console.log(this.favs);
              resolve();
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
        await this.db.object(`usuarios/${this.uid}/favoritos/productos/todos/${id}/${categoria}/${producto}`).remove();
        await this.db.object(`usuarios/${this.uid}/favoritos/productos/por-negocio/${id}/${producto}`).remove();
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
    return new Promise(async (resolve, reject) => {
      const cart: any = await this.getCartResumen(id);
      if (cart) {
        this.total = cart.cuenta;
        this.cuenta.next(cart.cuenta);
        this.cantidad.next(cart.cantidad);
        const cartt: any = await this.getCartProds(id);
        if (cartt) {
          this.carrito = cartt;
          this.cart.next(this.carrito);
          this.localProdsCart = [...this.carrito];
          console.log(this.carrito);
        }
      }
      resolve();
    });
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

  resetLocalProds(categoria, pasillo) {
    this.localProdsCart = this.carrito.filter(p => p.categoria === categoria && p.pasillo === pasillo);
    this.localFavs = this.favs.filter(p => p.categoria === categoria && p.pasillo === pasillo);
    return;
  }

  fillAgainProds() {
    this.localProdsCart = [...this.carrito];
    this.localFavs = [...this.favs];
    return;
  }

  updateProductsQty(prods: Producto[]): Promise<Producto[]> {
    return new Promise(async (resolve, reject) => {
      if (this.localProdsCart.length > 0) {
        this.localProdsCart.forEach((prod) => {
          const index = prods.findIndex(p => p.id === prod.id);
          if (index >= 0) {
            prods[index].cantidad = prod.cantidad;
            prods[index].cart = true;
            prod.use = true;
          } else {
            prod.use = false;
          }
        });
        this.localProdsCart = this.localProdsCart.filter(x => x.use === false);
      }
      if (this.localFavs.length > 0) {
        this.localFavs.forEach((fav) => {
          const index = prods.findIndex(p => p.id === fav.id);
          if (index >= 0) {
            prods[index].guardado = true;
            fav.use = true;
          }
        });
        this.localFavs = this.localFavs.filter(x => x.use === false);
      }
      resolve(prods);
    });
  }

  updateProdQty(producto: Producto): Promise<Producto> {
    return new Promise(async (resolve, reject) => {
      if (this.localProdsCart.length > 0) {
        const index = this.localProdsCart.findIndex(p => p.id === producto.id);
        if (index >= 0) {
          producto.cantidad = this.localProdsCart[index].cantidad;
          producto.cart = true;
        }
      }
      if (this.localFavs.length > 0) {
        const i = this.localFavs.findIndex(p => p.id === producto.id);
        if (i >= 0) {
          producto.guardado = true;
        }
      }
      resolve(producto);
    });
  }

  async addProduct(producto, pasillo, id) {
    return new Promise(async (resolve, reject) => {
      try {
        if (this.carrito.length === 0) {
          await this.guardaProducto(producto, pasillo, id);
          return resolve(true);
        }
        const index = this.carrito.findIndex(prod => prod.id === producto.id);
        if (index < 0) {
          await this.guardaProducto(producto, pasillo, id);
          return resolve(true);
        }
      } catch (error) {
        return reject(error);
      }
    });
  }

  async guardaProducto(producto, pasillo, id) {
    producto.pasillo = pasillo;
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
    this.localFavs = [];
    this.favs = [];
    this.localProdsCart = [];
    this.total = 0;
    this.refreshCart(id);
  }

  clearLocalCart() {
    this.carrito = [];
    this.localFavs = [];
    this.favs = [];
    this.localProdsCart = [];
    this.total = 0;
    this.cart.next(this.carrito);
    this.cuenta.next(this.total);
    this.cantidad.next(this.carrito.length);
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

  async updateCart(cart, cuenta, id) {
    this.total = cuenta;
    cart.forEach((p, i) => {
      if (p.cantidad === 0 ) {
        cart.splice(i, 1);
      }
    });
    this.carrito = [...cart];
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

  async addProductoFav(producto: Producto, id) {
    const prodFav = {...producto};
    delete prodFav.guardado;
    delete prodFav.cantidad;
    delete prodFav.total;
    delete prodFav.cart;
    try {
      await this.guardarProductoFavorito(id, producto.categoria, producto);

    } catch (error) {
      console.log(error);
    }
  }






}
