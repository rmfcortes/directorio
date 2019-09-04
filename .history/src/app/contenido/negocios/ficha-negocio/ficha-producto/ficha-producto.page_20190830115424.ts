import { Component, OnInit, Input } from '@angular/core';
import { ModalController, ToastController, AlertController } from '@ionic/angular';
import { PasillosService } from 'src/app/services/pasillos.service';
import { Producto } from 'src/app/interfaces/negocio.interface';
import { UidService } from 'src/app/services/uid.service';
import { LoginPage } from 'src/app/contenido/login/login.page';

@Component({
  selector: 'app-ficha-producto',
  templateUrl: './ficha-producto.page.html',
  styleUrls: ['./ficha-producto.page.scss'],
})
export class FichaProductoPage implements OnInit {

  @Input() producto: Producto;
  @Input() id: string;
  @Input() pasillo: string;
  @Input() nombre: string;

  uid: string;
  productoFav = false;
  productAdd = false;
  cambios = false;

  constructor(
    private modalCtrl: ModalController,
    private toastController: ToastController,
    private alertController: AlertController,
    private pasilloService: PasillosService,
    private uidService: UidService
  ) { }

  ngOnInit() {
  }

  async ionViewDidEnter() {
    this.uid = await this.uidService.getUid();
  }

  async agregarProductoFavorito() {
    if (!this.producto.guardado) {
      try {
        if (!this.uid) {
          this.productoFav = true;
          this.presentLogin('producto');
          return;
        }
        await this.pasilloService.addProductoFav(this.producto, this.id, this.nombre);
        this.producto.guardado = true;
        this.productoFav = false;
        this.presentToast('Producto guardado en tu lista de Favoritos');
      } catch (error) {
        this.presentAlertError(error);
      }
    } else {
      return;
    }
  }

  async borrarProductoFavorito() {
    try {
      await this.pasilloService.borrarProductoFavorito(this.id, this.producto.id);
      this.producto.guardado = false;
      this.presentToast('Producto eliminado de tu lista de Favoritos');
    } catch (error) {
      console.log(error);
    }
  }

  async addProduct() {
    if (!this.uid) {
      this.productAdd = true;
      this.presentLogin('producto');
      return;
    }
    try {
      await this.pasilloService.addProduct(this.producto, this.pasillo, this.id);
      this.productAdd = false;
      this.producto.cart = true;
    } catch (error) {
      this.presentAlertError(error);
    }
  }

  async plusProduct() {
    this.producto.cantidad += 1;
    this.pasilloService.plusProduct(this.producto, this.id);
  }

  async minusProduct() {
    this.producto.cantidad -= 1;
    if (this.producto.cantidad === 0) {
      this.producto.cart = false;
    }
    this.pasilloService.restProduct(this.producto, this.producto.cantidad, this.id);
  }

  actualizaCart(data) {
    this.cambios = true;
    const carrito = data.cart;
    if (carrito.length > 0) {
      const i = carrito.findIndex(p => p.id === this.producto.id);
      if (i >= 0) {
        this.producto.cantidad = carrito[i].cantidad;
        this.producto.total = carrito[i].cantidad * carrito[i].precio;
        if (carrito[i].cantidad === 0 ) {
          this.producto.cart = false;
        }
      }
      this.pasilloService.updateCart(carrito, data.cuenta, this.id);
    } else {
      this.emptyCart();
    }
  }

  emptyCart() {
    this.pasilloService.clearCart(this.id);
    if (this.producto.cantidad) {
      delete this.producto.cantidad;
      delete this.producto.total;
      delete this.producto.cart;
    }
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
        this.producto = await this.pasilloService.updateProdQty(this.producto);
        if (this.productoFav) {
          this.agregarProductoFavorito();
        }
        if (this.productAdd) {
          this.addProduct();
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

  regresar() {
    this.pasilloService.fillAgainProds();
    this.modalCtrl.dismiss(this.cambios);
  }

}
