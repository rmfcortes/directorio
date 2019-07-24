import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { PasillosService } from 'src/app/services/pasillos.service';
import { Producto } from 'src/app/interfaces/negocio.interface';
import { UidService } from 'src/app/services/uid.service';

@Component({
  selector: 'app-ficha-producto',
  templateUrl: './ficha-producto.page.html',
  styleUrls: ['./ficha-producto.page.scss'],
})
export class FichaProductoPage implements OnInit {

  @Input() producto: Producto;
  @Input() id: string;

  uid: string;

  constructor(
    private modalCtrl: ModalController,
    private pasilloService: PasillosService,
    private uidService: UidService
  ) { }

  ngOnInit() {
    console.log(this.producto);
  }

  async ionViewDidEnter() {
    this.uid = await this.uidService.getUid();
  }

  async agregarProductoFavorito(producto: Producto, i) {
    if (!this.producto.guardado) {
      try {
        if (!this.uid) {
          this.presentLogin('producto');
          return;
        }
        await this.pasilloService.addProductoFav(producto, this.id);
        this.producto.guardado = true;
        this.presentToast('Producto guardado en tu lista de Favoritos');
      } catch (error) {
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
    const carrito = data.cart;
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

  regresar() {
    this.pasilloService.fillAgainProds();
    this.modalCtrl.dismiss();
  }

}
