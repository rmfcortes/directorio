import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PasillosService } from 'src/app/services/pasillos.service';
import { Location } from '@angular/common';
import { UidService } from 'src/app/services/uid.service';
import { VariablesService } from 'src/app/services/variables.service';
import { ToastController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-lista-productos',
  templateUrl: './lista-productos.page.html',
  styleUrls: ['./lista-productos.page.scss'],
})
export class ListaProductosPage {

  productos: any;
  id: string;
  categoria = '';
  pasillo = '';
  uid = '';

  batch = 18;
  lazyBatch = 12;
  lastKey = '';
  noMore = false;
  favs = [];

  infoReady = false;

  cart = [];
  cuenta = 0;
  cantidad = 0;

  isOpen = false;
  direccionReady = false;

  localProdsCart = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private router: Router,
    private toastController: ToastController,
    private alertController: AlertController,
    private pasilloService: PasillosService,
    private uidService: UidService,
    private variableService: VariablesService
  ) { }

  async ionViewDidEnter() {
    this.getDatos();
  }

  async getDatos() {
    this.activatedRoute.params.subscribe(async (data) => {
      this.noMore = false;
      this.id = data['id'];
      this.categoria = data['categoria'];
      this.pasillo = data['pasillo'];
      this.uid = await this.uidService.getUid();
      const prods = await this.getProductos();
      await this.getPendientes();
      const cart = await this.getCart(prods);
      const favs = await this.getFavoritos(cart);
      this.productos = favs;
      this.infoReady = true;
      console.log(this.cuenta);
      console.log(this.cantidad);
      console.log(this.productos);
    });
  }

  async getPendientes() {
    if (!this.uid) { return; }
    const pendiente = await this.variableService.getSave();
    if (pendiente) {
      const type = await this.variableService.getPendientType();
      const i = await this.variableService.getIndex();
      if (type === 'producto') {
        await this.addProduct(this.productos[i], i);
      } else {
        await this.agregarFavorito(i);
      }
    }
    return;
  }

  async getProductos() {
    const prod: any = await this.pasilloService.getProductos(this.id, this.pasillo, this.categoria, this.batch + 1);
    if (prod.length === this.batch + 1) {
      this.lastKey = prod[prod.length - 1].id;
      prod.pop();
    } else {
      this.noMore = true;
    }
    return prod;
  }

  async getCart(prods) {
    if (!this.uid) { return prods; }
    const cart: any = await this.pasilloService.getCartResumen(this.id);
    let prodsAndCart = prods;
    if (cart) {
      this.cuenta = cart.cuenta;
      this.cantidad = cart.cantidad;
      const carrito: any = await this.pasilloService.getCartProds(this.id);
      if (carrito) {
        this.cart = carrito;
        this.localProdsCart = carrito.filter(c => c.categoria === this.categoria);
        prodsAndCart = await this.updateProductsQty(prods);
      }
    }
    return prodsAndCart;
  }

  updateProductsQty(prods) {
    this.localProdsCart.forEach((prod, i) => {
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

  async getFavoritos(prods) {
    if (!this.uid) { return prods; }
    let result = prods;
    const favs = await this.pasilloService.getProductosFavoritos(this.id, this.categoria);
    if (favs) {
      this.favs = Object.keys(favs);
      result = await this.isFavorito(prods);
    }
    return result;
  }

  isFavorito(productos) {
    if (this.favs.length > 0) {
      productos.forEach(async (producto, i) => {
        producto.guardado = false;
        for (const key of this.favs) {
          if (producto.id === key) {
            producto.guardado = true;
            break;
          }
        }
      });
    }
    return productos;
  }

  async loadData(event) {
    if (this.noMore) {
      event.target.disabled = true;
      event.target.complete();
      return;
    }
    let prod: any = await this.pasilloService.getProductos(this.id, this.pasillo, this.categoria, this.lazyBatch + 1, this.lastKey);

    if (prod) {
      if (prod.length === this.lazyBatch + 1) {
        this.lastKey = prod[prod.length - 1].id;
        prod.pop();
      } else {
        this.noMore = true;
      }
      if (this.uid) {
        const prodsAndCart = await this.updateProductsQty(prod);
        const ofer: any = await this.isFavorito(prodsAndCart);
        this.productos = this.productos.concat(ofer);
      } else {
        this.productos = this.productos.concat(prod);
      }
    }

    event.target.complete();

    // App logic to determine if all data is loaded
    // and disable the infinite scroll
    if (this.noMore) {
      event.target.disabled = true;
    }
  }

  async addProduct(producto, i) {
    if (!this.uid) {
      this.variableService.setSave(true);
      this.variableService.setIndex(i);
      this.variableService.setPendientType('producto');
      this.router.navigate(['/login', 'menu', 'producto']);
      return;
    }
    if (this.cart.length === 0) {
      await this.guardaProducto(producto, i);
      this.variableService.setSave(false);
      this.variableService.setIndex(null);
      return;
    }
    const index = this.cart.findIndex(prod => prod.id === producto.id);
    if (index < 0) {
      await this.guardaProducto(producto, i);
      this.variableService.setSave(false);
      this.variableService.setIndex(null);
      this.variableService.setPendientType('');
      return;
    }
  }

  async guardaProducto(producto, i) {
    producto.cantidad = 1;
    producto.total = producto.precio;
    producto.index = i;
    producto.categoria = this.categoria;
    this.cart.push({...producto});
    this.cuenta += producto.precio;
    this.productos[i].cart = true;
    await this.pasilloService.actualizaCarrito(this.id);
    return;
  }

  plusData(data) {
    this.plusProduct(data.producto, data.i);
  }

  async plusProduct(producto, i) {
    this.productos[i].cantidad += 1;
    const index = this.cart.findIndex(prod => prod.id === producto.id);
    this.cart[index].cantidad += 1;
    this.cart[index].total += producto.precio;
    this.cuenta += producto.precio;
    await this.pasilloService.actualizaCarrito(this.id);
  }

  minusData(data) {
    this.minusProduct(data.producto, data.i);
  }

  async minusProduct(producto, i) {
    this.productos[i].cantidad -= 1;
    this.cuenta -= producto.precio;
    const index = this.cart.findIndex(prod => prod.id === producto.id);
    if (this.productos[i].cantidad === 0) {
      this.productos[i].cart = false;
      this.cart.splice(index, 1);
      await this.pasilloService.actualizaCarrito(this.id);
      return;
    }
    this.cart[index].cantidad -= 1;
    this.cart[index].total -= producto.precio;
    await this.pasilloService.actualizaCarrito(this.id);
  }

  async agregarFavorito(i) {
    if (!this.productos[i].guardando) {
      if (!this.uid) {
        this.variableService.setSave(true);
        this.variableService.setIndex(i);
        this.variableService.setPendientType('favorito');
        this.router.navigate(['/login', 'menu', 'favorito']);
        return;
      }
      if (!this.productos[i].guardado) {
        this.productos[i].guardando = true;
        const favorito = {
          url: this.productos[i].url,
          id: this.productos[i].id,
          nombre: this.productos[i].nombre,
          precio: this.productos[i].precio,
          unidad: this.productos[i].unidad,
        };
        try {
          await this.pasilloService.guardarProductoFavorito(this.id, this.categoria, favorito);
          this.variableService.setSave(false);
          this.variableService.setIndex(null);
          this.variableService.setPendientType('');
          this.productos[i].guardando = false;
          this.productos[i].guardado = true;
          this.presentToast('Producto guardado en tu lista de Favoritos');
        } catch (error) {
          this.productos[i].guardando = false;
          this.presentAlertError(error);
        }
      } else {
        return;
      }
    } else {
      return;
    }
  }

  async borrarFavorito(i) {
    try {
      await this.pasilloService.borrarProductoFavorito(this.id, this.categoria, this.productos[i].id);
      this.productos[i].guardado = false;
      this.presentToast('Producto eliminado de tu lista de Favoritos');
    } catch (error) {
      console.log(error);
    }
  }

  async presentToast(mensaje) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000
    });
    toast.present();
  }

  async presentAlertError(error) {
    const alert = await this.alertController.create({
      header: 'Ups, algo salió mal, intenta de nuevo',
      message: error,
      buttons: [
        {
          text: 'Ok',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }
      ]
    });

    await alert.present();
  }

  emptyCart() {
    this.productos.forEach(producto => {
      if (producto.cantidad) {
        delete producto.cantidad;
        delete producto.index;
        delete producto.total;
        delete producto.cart;
      }
    });
    this.isOpen = false;
  }

  regresar() {
    this.location.back();
  }

}
