import { Component, Input, ViewChild } from '@angular/core';
import { PasillosService } from 'src/app/services/pasillos.service';
import { ModalController, IonSlides, ToastController, AlertController } from '@ionic/angular';
import { CategoriasPasillo, Producto } from 'src/app/interfaces/negocio.interface';
import { UidService } from 'src/app/services/uid.service';
import { LoginPage } from '../login/login.page';

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
  productos: Producto[];

  slideOpts = {
    initialSlide: 0,
    slidesPerView: 1,
    autoplay: false,
    loop: false,
    centeredSlides: true,
    speed: 400
  };

  isOpen = false;

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

  constructor(
    private modalCtrl: ModalController,
    private toastController: ToastController,
    private alertController: AlertController,
    private uidService: UidService,
    private pasilloService: PasillosService
  ) { }

  async ionViewDidEnter() {
    this.slide.lockSwipes(true);
    this.getDatos();
  }

  async getDatos() {

    this.id = this.data.id;
    this.pasillo = this.data.pasillo;
    this.uid = this.data.uid;
    this.categorias = await this.pasilloService.getCategorias(this.id, this.pasillo);
  }

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

  async getProductos() {
    const prod: Producto[] = await this.pasilloService.getProductos(this.id, this.pasillo, this.subCategoria, this.batch + 1);
    if (prod.length === this.batch + 1) {
      this.lastKey = prod[prod.length - 1].id;
      prod.pop();
    } else {
      this.noMore = true;
    }
    await this.pasilloService.resetLocalProds(this.subCategoria, this.pasillo);
    this.productos = await this.pasilloService.updateProductsQty(prod);
  }

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
        await this.pasilloService.addProductoFav(producto, this.id);
        this.productos[i].guardado = true;
        this.productoFav.agregar = false;
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
      await this.pasilloService.borrarProductoFavorito(this.id, prod.categoria, prod.id);
      this.productos[i].guardado = false;
      this.presentToast('Producto eliminado de tu lista de Favoritos');
    } catch (error) {
      console.log(error);
    }
  }

  async addProduct(producto: Producto, i: number) {
    if (!this.uid) {
      this.productAdd.producto = producto;
      this.productAdd.i = i;
      this.productAdd.agregar = true;
      this.presentLogin('producto');
      return;
    }
    try {
      await this.pasilloService.addProduct(producto, this.pasillo, this.id);
      this.productos[i].cart = true;
      this.productAdd.agregar = false;
    } catch (error) {
      this.productAdd.agregar = false;
      this.presentAlertError(error);
    }
  }

  async plusProduct(producto, i) {
    this.productos[i].cantidad += 1;
    this.pasilloService.plusProduct(producto, this.id);
  }

  async minusProduct(producto, i) {
    this.productos[i].cantidad -= 1;
    if (this.productos[i].cantidad === 0) {
      this.productos[i].cart = false;
    }
    this.pasilloService.restProduct(producto, this.productos[i].cantidad, this.id);
  }

  actualizaCart(data) {
    console.log(this.productos);
    const carrito = data.cart;
    console.log(carrito);
    if (carrito.length > 0) {
      console.log('Tiene length');
      carrito.forEach(prod => {
        const i = this.productos.findIndex(p => p.nombre === prod.pasillo);
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
    this.isOpen = false;
  }


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
        this.productos = await this.pasilloService.updateProductsQty(this.productos);
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

  regresarCategorias() {
    this.slide.lockSwipes(false);
    this.slide.slidePrev();
    this.subCategoriaSelected = false;
    this.slide.lockSwipes(true);
  }

  regresar() {
    this.modalCtrl.dismiss();
  }


}
