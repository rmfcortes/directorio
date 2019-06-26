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

  isOpen = false;
  direccionReady = false;

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
      const prod: any = await this.pasilloService.getProductos(this.id, this.pasillo, this.categoria, this.batch + 1);
      if (prod.length === this.batch + 1) {
        this.lastKey = prod[prod.length - 1].id;
        prod.pop();
      } else {
        this.noMore = true;
      }
      this.productos = prod;
      await this.isFavorito();
      this.infoReady = true;
      console.log(this.productos);
    });
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
        const ofer: any = await this.isFavoritoLoad(prod);
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

  async isFavorito() {
    const favs = await this.pasilloService.getProductosFavoritos(this.uid, this.id, this.categoria);
    console.log(favs);
    if (Object.keys(favs).length > 0) {
      this.favs = Object.keys(favs);
      this.productos.forEach(async (producto) => {
        producto.guardado = false;
        for (const key of this.favs) {
          if (producto.id === key) {
            producto.guardado = true;
            break;
          }
        }
      });
    }
    return;
  }

  async addProduct(producto, i) {
    if (this.cart.length === 0) {
      await this.guardaProducto(producto, i);
      return;
    }
    const index = this.cart.findIndex(prod => prod.id === producto.id);
    if (index < 0) {
      await this.guardaProducto(producto, i);
      return;
    }
  }

  async guardaProducto(producto, i) {
    // await this.pasilloService.addProductoCarrito(this.uid, this.id, producto);
    producto.cantidad = 1;
    producto.total = producto.precio;
    this.cart.push({...producto});
    this.cuenta += producto.precio;
    this.productos[i].cart = true;
    console.log(this.cuenta);
    console.log(this.cart);
    return;
  }

  plusProduct(producto, i) {
    this.productos[i].cantidad += 1;
    const index = this.cart.findIndex(prod => prod.id === producto.id);
    this.cart[index].cantidad += 1;
    this.cart[index].total += producto.precio;
    this.cuenta += producto.precio;
    console.log(this.cart);
    console.log(this.cuenta);
  }

  minusProduct(producto, i) {
    this.productos[i].cantidad -= 1;
    this.cuenta -= producto.precio;
    const index = this.cart.findIndex(prod => prod.id === producto.id);
    if (this.productos[i].cantidad === 0) {
      this.productos[i].cart = false;
      this.cart.splice(index, 1);
      console.log(this.cart);
      console.log(this.cuenta);
      return;
    }
    this.cart[index].cantidad -= 1;
    this.cart[index].total -= producto.precio;
    console.log(this.cart);
    console.log(this.cuenta);
  }

  async isFavoritoLoad(productos) {
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

  async agregarFavorito(i) {
    if (!this.productos[i].guardando) {
      if (!this.uid) {
        this.variableService.setSave(true);
        this.variableService.setIndex(i);
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
          console.log(favorito);
          await this.pasilloService.guardarProductoFavorito(this.uid, this.id, this.categoria, favorito);
          this.variableService.setSave(false);
          this.variableService.setIndex(null);
          this.productos[i].guardando = false;
          this.productos[i].guardado = true;
          this.presentToast('Oferta guardada');
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
      await this.pasilloService.borrarProductoFavorito(this.uid, this.id, this.categoria, this.productos[i].id);
      this.productos[i].guardado = false;
      this.presentToast('Oferta borrada');
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

  openCart() {
    this.isOpen = true;
    document.getElementById('mySidenav').style.height = '80%';
    document.getElementById('mySidenav').style.background = 'white';
  }

  closeCart() {
    this.isOpen = false;
    document.getElementById('mySidenav').style.height = '0';
    document.getElementById('mySidenav').style.background = '#d6fccc';
  }

  regresar() {
    this.location.back();
  }

}
