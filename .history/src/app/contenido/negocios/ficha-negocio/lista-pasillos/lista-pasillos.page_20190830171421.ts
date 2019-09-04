import { Component, Input, ViewChild } from '@angular/core';
import { PasillosService } from 'src/app/services/pasillos.service';
import { ModalController, IonSlides, ToastController, AlertController } from '@ionic/angular';
import { CategoriasPasillo, Producto } from 'src/app/interfaces/negocio.interface';
import { UidService } from 'src/app/services/uid.service';
import { LoginPage } from '../../../login/login.page';
import { FichaProductoPage } from '../ficha-producto/ficha-producto.page';

@Component({
  selector: 'app-lista-pasillos',
  templateUrl: './lista-pasillos.page.html',
  styleUrls: ['./lista-pasillos.page.scss'],
})
export class ListaPasillosPage {

  @Input() data;
  @ViewChild(IonSlides) slide: IonSlides;

  categorias: CategoriasPasillo[];
  subCategoriaSelected = false;
  subCategoria: string;
  id: string;
  pasillo = '';
  uid = '';
  vista: string;
  productos: Producto[];

  slideOpts = {
    initialSlide: 0,
    slidesPerView: 1,
    autoplay: false,
    loop: false,
    centeredSlides: true,
    speed: 400
  };

  batch = 18;
  lazyBatch = 12;
  lastKey = '';
  noMore = false;
  favs = [];

  productoFav = {
    agregar: false,
    producto: null,
    i: null,
  };

  productAdd = {
    agregar: false,
    producto: null,
    pasillo: '',
    i: null,
  };

  modalClosed = true;
  cambios = false;

  constructor(
    private modalCtrl: ModalController,
    private toastController: ToastController,
    private alertController: AlertController,
    private uidService: UidService,
    private pasilloService: PasillosService
  ) { }

  async ionViewDidEnter() {
    this.getDatos();
  }

  async getDatos() {
    this.vista = this.data.vista;
    this.id = this.data.id;
    this.pasillo = this.data.pasillo;
    this.uid = this.data.uid;
    if (this.vista === 'Bloque') {
      setTimeout(async () => {        
        this.slide.lockSwipes(true);
        this.categorias = await this.pasilloService.getCategorias(this.id, this.pasillo);
      }, 150);
    } else if (this.vista === 'Lista') {
      this.getProductosLista();
    }
  }

  //// Lógica Exclusiva Bloque

  display(i) {
    if (!this.categorias[i].display) {
      this.categorias[i].display = true;
      return;
    }
    this.categorias[i].display = false;
  }

  slideToSub(subCategoria) {
    this.subCategoria = subCategoria;
    this.slide.lockSwipes(false);
    this.slide.slideNext();
    this.subCategoriaSelected = true;
    this.slide.lockSwipes(true);
    this.getProductos();
  }

  //// Get Productos Bloque

  async getProductos() {
    const prod: Producto[] = await this.pasilloService.getProductos(this.id, this.pasillo, this.subCategoria, this.batch + 1);
    if (prod.length === this.batch + 1) {
      this.lastKey = prod[prod.length - 1].id;
      prod.pop();
    } else {
      this.noMore = true;
    }
    await this.pasilloService.resetLocalProds(this.subCategoria, this.pasillo);
    this.productos = await this.pasilloService.updateProductsQty(prod, 'pasillo');
  }

  //// Get Productos Lista

  async getProductosLista() {
    const prod: Producto[] = await this.pasilloService.getProductosLista(this.id, this.pasillo, this.batch + 1);
    if (prod.length === this.batch + 1) {
      this.lastKey = prod[prod.length - 1].id;
      prod.pop();
    } else {
      this.noMore = true;
    }
    await this.pasilloService.resetLocalProdsLista(this.pasillo);
    this.productos = await this.pasilloService.updateProductsQty(prod, 'pasillo');
    console.log(this.productos);
  }

  //// Lógica favoritos

  async agregarProductoFavorito(producto: Producto, i) {
    if (!this.productos[i].guardado) {
      try {
        if (!this.uid) {
          this.productoFav.producto = producto;
          this.productoFav.i = i;
          this.productoFav.agregar = true;
          this.presentLogin('producto');
          return;
        }
        await this.pasilloService.addProductoFav(producto, this.id, this.data.nombre);
        this.productos[i].guardado = true;
        this.productoFav.agregar = false;
        this.cambios = true;
        this.presentToast('Producto guardado en tu lista de Favoritos');
      } catch (error) {
        this.productoFav.agregar = false;
        this.presentAlertError(error);
      }
    } else {
      return;
    }
  }

  async borrarProductoFavorito(prod, i) {
    try {
      await this.pasilloService.borrarProductoFavorito(this.id, prod.id);
      this.productos[i].guardado = false;
      this.cambios = true;
      this.presentToast('Producto eliminado de tu lista de Favoritos');
    } catch (error) {
      console.log(error);
    }
  }

  //// Lógica cart

  async addProduct(producto: Producto, i: number) {
    if (!this.uid) {
      this.productAdd.producto = producto;
      this.productAdd.i = i;
      this.productAdd.agregar = true;
      this.presentLogin('producto');
      return;
    }
    try {
      await this.pasilloService.addProduct(producto, this.id);
      this.productos[i].cart = true;
      this.productAdd.agregar = false;
      this.cambios = true;
    } catch (error) {
      this.productAdd.agregar = false;
      this.presentAlertError(error);
    }
  }

  async plusProduct(producto, i) {
    this.productos[i].cantidad += 1;
    this.pasilloService.plusProduct(producto, this.id);
    this.cambios = true;
  }

  async minusProduct(producto, i) {
    this.productos[i].cantidad -= 1;
    if (this.productos[i].cantidad === 0) {
      this.productos[i].cart = false;
    }
    this.pasilloService.restProduct(producto, this.productos[i].cantidad, this.id);
    this.cambios = true;
  }

  actualizaCart(data) {
    const carrito = data.cart;
    this.cambios = true;
    if (carrito.length > 0) {
      carrito.forEach(prod => {
        const i = this.productos.findIndex(p => p.id === prod.id);
        if (i >= 0) {
          this.productos[i].cantidad = prod.cantidad;
          this.productos[i].total = prod.cantidad * prod.precio;
          if (prod.cantidad === 0 ) {
            this.productos[i].cart = false;
          }
        }
      });
      this.pasilloService.updateCart(carrito, data.cuenta, this.id);
    } else {
      this.emptyCart();
    }
  }

  emptyCart() {
    this.pasilloService.clearCart(this.id);
    this.productos.forEach(producto => {
      if (producto.cantidad) {
        delete producto.cantidad;
        delete producto.total;
        delete producto.cart;
      }
    });
  }

  //// Actions

  async muestraProducto(prod) {
    this.modalClosed = false;
    const modal = await this.modalCtrl.create({
      component: FichaProductoPage,
      componentProps: { producto: prod, id: this.id, pasillo: this.pasillo}
    });
    modal.onDidDismiss().then(async (info) => {
      this.modalClosed = true;
      if (info.data.cambios) {
        this.productos.forEach(producto => {
          producto.cantidad = 0;
          producto.total = 0;
          producto.cart = false;
        });
        this.productos = await this.pasilloService.updateProductsQty(Object.values(this.productos), 'pasillo');
        this.cambios = true;
      }
    });
    return await modal.present();
  }

  //// Auxiliares

  async presentLogin(type) {
    const modal = await this.modalCtrl.create({
      component: LoginPage,
      componentProps: { tipo: type }
    });

    modal.onDidDismiss().then(async () => {
      this.uid = await this.uidService.getUid();
      if (this.uid) {
        this.pasilloService.setUid();
        await this.pasilloService.getAllProductosFavoritos(this.id);
        await this.pasilloService.getCart(this.id);
        this.productos = await this.pasilloService.updateProductsQty(this.productos, 'pasillo');
        if (this.productoFav.agregar) {
          this.agregarProductoFavorito(this.productoFav.producto, this.productoFav.i);
        }
        if (this.productAdd.agregar) {
          this.addProduct(this.productAdd.producto, this.productAdd.i);
        }
      }
    });
    return await modal.present();
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


  //// Salir

  regresarCategorias() {
    this.slide.lockSwipes(false);
    this.slide.slidePrev();
    this.subCategoriaSelected = false;
    this.slide.lockSwipes(true);
  }

  regresar() {
    this.pasilloService.fillAgainProds();
    this.modalCtrl.dismiss({cambios: this.cambios, prods: this.productos});
  }


}
