import { Component, Input } from '@angular/core';
import { AlertController, ModalController, ToastController } from '@ionic/angular';

import { CallNumber } from '@ionic-native/call-number/ngx';

import { InfoSucursalModalPage } from '../../info-sucursal-modal/info-sucursal-modal.page';
import { LoginPage } from '../../login/login.page';

import { PasillosService } from 'src/app/services/pasillos.service';
import { NegociosService } from 'src/app/services/negocios.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { UidService } from 'src/app/services/uid.service';
import { Pasillo, Producto, Negocio,
         PrevDataNegocio, ResultNegocio, VistaPreviaNegocio
        } from 'src/app/interfaces/negocio.interface';
import { MapaPage } from '../../mapa/mapa.page';
import { ListaComentariosModalPage } from '../../lista-comentarios-modal/lista-comentarios-modal.page';
import { ListaPasillosPage } from './lista-pasillos/lista-pasillos.page';
import { FichaProductoPage } from './ficha-producto/ficha-producto.page';
import { PreguntasModalComponent } from '../../preguntas-modal/preguntas-modal.component';

@Component({
  selector: 'app-ficha-negocio',
  templateUrl: './ficha-negocio.page.html',
  styleUrls: ['./ficha-negocio.page.scss'],
})
export class FichaNegocioPage {

  @Input() infoNegocio: VistaPreviaNegocio;
  @Input() categoria;

  uid = '';
  id: string;
  negocio: Negocio;
  infoReady = false;

  guardado = false;
  guardando = false;

  noLongerExist = false;

  sliderConfig = {
    slidesPerView: 1,
    autoplay: true,
    centeredSlides: true,
    speed: 400
  };

  productos: Pasillo[] = [];
  productosLista: Producto[];
  pasillos = [];
  yPasillo = 0;

  isVisible = true;

  prodsReady = false;

  noMore = false;
  batch = 3;
  batchLista = 12;
  lastKey = '';

  productAdd = {
    agregar: false,
    producto: null,
    pasillo: 'string',
    i: null,
    y: null
  };

  productoFav = {
    agregar: false,
    producto: null,
    i: null,
    y: null
  };

  modalClosed = true;
  favReady = false;

  constructor(
    private toastController: ToastController,
    private modalController: ModalController,
    public alertController: AlertController,
    private callNumber: CallNumber,
    private negocioService: NegociosService,
    private pasilloService: PasillosService,
    private usuarioService: UsuarioService,
    private uidService: UidService,
  ) { }

  async ionViewDidEnter() {
    this.prodsReady = false;
    this.infoReady = false;
    this.getDatos();
  }

  ///// Info de Negocio, Uid, Pasillos

  async getDatos() {
    this.id = this.infoNegocio.id;
    this.uid = await this.uidService.getUid();
    if (this.uid) { await this.isFavorito(); }
    this.pasillos = await this.negocioService.getPasillos(this.id);
    const result: ResultNegocio =  await this.negocioService.getNegocio(this.id);
    const prevData: PrevDataNegocio = this.infoNegocio;
    this.negocio = {...result, ...prevData};
    this.infoReady = true;
    this.pasilloService.setUid();
    this.pasilloService.clearLocalCart();
    if (!result) {
      this.noLongerExist = true;
      return;
    }
    await this.agregaProdFavsInList();
    if (this.negocio.vista === 'Bloque') {
      await this.getInfoProdsBloque();
    } else if (this.negocio.vista === 'Lista') {
      this.getInfoProdsLista();
    }
  }

  ///// Info de Productos Bloque

  async getInfoProdsBloque() {
    return new Promise(async (resolve, reject) => {
      const destacados = await this.negocioService.getProductosDestacados(this.id);
      const destcadosArray: Pasillo = {
        nombre: 'Más vendidos',
        productos: destacados
      };
      const prod: Pasillo[] = await this.negocioService.getProductos(this.id, this.batch + 1);
      if (prod.length === this.batch + 1) {
        this.lastKey = prod[prod.length - 1].nombre;
        prod.pop();
      } else {
        this.noMore = true;
      }
      this.productos = [...prod];
      this.productos.unshift(destcadosArray);
      if (this.uid) {
        await this.evaluaCantFav();
      }
      if (!this.uid) {
        this.productos.forEach(async (p, i) => {
          this.productos[i].productos = Object.values(p.productos);
          if (i + 1 === this.productos.length) {
            this.prodsReady = true;
          }
        });
      }
      return resolve();
    });
  }

  async loadData(event) {
    if (this.noMore) {
      event.target.disabled = true;
      event.target.complete();
      return;
    }
    const prod: any = await this.negocioService.getProductos(this.id, this.batch + 1, this.lastKey);

    if (prod) {
      if (prod.length === this.batch + 1) {
        this.lastKey = prod[prod.length - 1].nombre;
        prod.pop();
      } else {
        this.noMore = true;
      }
      if (this.uid) {
        prod.forEach(async (p, i) => {
          p.productos = await this.pasilloService.updateProductsQty(Object.values(p.productos));
        });
      } else {
        prod.forEach(async (p, i) => {
          p.productos = Object.values(p.productos);
        });
      }
      this.productos = this.productos.concat(prod);
    }

    event.target.complete();

    // App logic to determine if all data is loaded
    // and disable the infinite scroll
    if (this.noMore) {
      event.target.disabled = true;
    }
  }

  ///// Info de Productos Lista

  async getInfoProdsLista() {
    this.productosLista = await this.negocioService
      .getProductosLista(this.id, this.pasillos[this.yPasillo], this.batchLista + 1);
    this.evaluaProdsLista();
  }

  async evaluaProdsLista() {
    if (this.productosLista.length === this.batch + 1) {
      this.lastKey = this.productosLista[this.productosLista.length - 1].nombre;
      this.productosLista.pop();
      this.agregaProductos();
    } else if (this.productosLista.length === this.batch && this.yPasillo + 1 < this.pasillos.length) {
      await this.agregaProductos();
      this.yPasillo++;
      this.lastKey = null;
    } else {
      this.noMore = true;
    }
    if (this.productosLista.length < this.batchLista && this.yPasillo + 1 < this.pasillos.length) {
      await this.agregaProductos();
      this.lastKey = null;
      this.yPasillo++;
      this.getMoreProdsLista();
    } else {
      this.agregaProductos();
      this.noMore = true;
    }
  }

  async agregaProductos() {
    return new Promise(async (resolve, reject) => {
      const prodArray: Pasillo = {
        nombre: this.pasillos[this.yPasillo],
        productos: this.productosLista
      };
      this.productos.push(prodArray);
      await this.evaluaCantFav();
      resolve();
    });
  }

  async getMoreProdsLista() {
    this.productosLista = await this.negocioService
        .getProductosLista(this.id, this.pasillos[this.yPasillo], this.batchLista + 1, this.lastKey);
    this.evaluaProdsLista();
  }

  //// Evalúa cantidad productos y favorito para ambos, Bloque y Lista

  async evaluaCantFav() {
    return new Promise(async (resolve, reject) => {
      await this.pasilloService.getCart(this.id);
      this.productos.forEach(async (p, i) => {
        this.productos[i].productos = await this.pasilloService.updateProductsQty(Object.values(p.productos));
        this.productos[i].productos = this.productos[i].productos.filter(pr => pr.guardado === false);
        if (this.productos[i].productos.length === 0) {
          this.productos.splice(i, 1);
        }
      });
      console.log(this.productos);
      this.prodsReady = true;
      resolve();
    });
  }

  ///// Evalúa Favoritos

  async agregaProdFavsInList() {
    return new Promise(async (resolve, reject) => {
      const prodsFav: Producto[] = await this.pasilloService.getAllProductosFavoritos(this.id);
      if (prodsFav) {
        const fav: Pasillo   = {
          nombre: 'Favoritos',
          productos: prodsFav
        };
        this.productos.push(fav);
      }
      resolve();
    });
  }

  async isFavorito() {
    return new Promise(async (resolve, reject) => {
      try {
        const resp = await this.usuarioService.getFavorito(this.id, this.categoria);
        if (resp) {
          this.guardado = true;
        } else {
          this.guardado = false;
        }
        this.favReady = true;
        resolve(true);
      } catch (err) {
        this.presentAlertError(err);
        reject();
      }
    });
  }

  async agregarProductoFavorito(producto: Producto, i: number, y: number) {
    if (!this.productos[i].productos[y].guardado) {
      try {
        if (!this.uid) {
          this.productoFav.producto = producto;
          this.productoFav.i = i;
          this.productoFav.y = y;
          this.productoFav.agregar = true;
          this.presentLogin('favorito');
          return;
        }
        await this.pasilloService.addProductoFav(producto, this.id, this.negocio.nombre);
        producto.guardado = true;
        this.actualizarListaFav(i, y, producto, 'Favoritos');
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

  async borrarProductoFavorito(prod, i, y) {
    try {
      // await this.pasilloService.borrarProductoFavorito(this.id, prod.id);
      prod.guardado = false;
      this.actualizarListaFav(i, y, prod, prod.pasillo);
      this.presentToast('Producto eliminado de tu lista de Favoritos');
    } catch (error) {
      console.log(error);
    }
  }

  actualizarListaFav(i, y, prod, pasillo) {
    this.productos[i].productos.splice(y, 1);
    if (this.productos[i].productos.length === 0) {
      this.productos.splice(i, 1);
    }
    const x = this.productos.findIndex(p => p.nombre === pasillo);
    if (x < 1) {
      const prodArray: Pasillo = {
        nombre: pasillo,
        productos: []
      };
      prodArray.productos.push(prod);
      this.productos.push(prodArray);
    } else {
      this.productos[x].productos.push(prod);
    }
  }

  async agregarFavorito() {
    this.guardando = true;
    if (!this.uid) {
      this.presentLogin('favorito');
      return;
    }
    const favorito = {
      nombre: this.negocio.nombre,
      url: this.negocio.url,
      descripcion: this.negocio.descripcion,
      id: this.negocio.id,
      categoria: this.negocio.categoria,
    };
    try {
      await this.usuarioService.guardarFavorito(favorito);
      this.guardando = false;
      this.guardado = true;
      this.presentToast('Negocio guardado en tu lista de Favoritos');
    } catch (error) {
      this.guardando = false;
      this.presentAlertError(error);
    }
  }

  async borrarFavorito() {
    try {
      await this.usuarioService.borrarFavorito(this.negocio.id, this.negocio.categoria);
      this.guardado = false;
      this.presentToast('Negocio borrado de tu lista de Favoritos');
    } catch (error) {
      console.log(error);
    }
  }

  //// Lógica Carrito

  async addProduct(producto: Producto, pasillo: string, i: number, y: number) {
    if (!this.uid) {
      this.productAdd.producto = producto;
      this.productAdd.pasillo = pasillo;
      this.productAdd.i = i;
      this.productAdd.y = y;
      this.productAdd.agregar = true;
      this.presentLogin('producto');
      return;
    }
    try {
      await this.pasilloService.addProduct(producto, pasillo, this.id);
      this.productos[i].productos[y].cart = true;
      this.productAdd.agregar = false;
    } catch (error) {
      this.productAdd.agregar = false;
      this.presentAlertError(error);
    }
  }

  async plusProduct(producto, i, y) {
    this.productos[i].productos[y].cantidad += 1;
    this.pasilloService.plusProduct(producto, this.id);
  }

  async minusProduct(producto, i, y) {
    this.productos[i].productos[y].cantidad -= 1;
    if (this.productos[i].productos[y].cantidad === 0) {
      this.productos[i].productos[y].cart = false;
    }
    this.pasilloService.restProduct(producto, this.productos[i].productos[y].cantidad, this.id);
  }

  actualizaCart(data) {
    const carrito = data.cart;
    if (carrito.length > 0) {
      carrito.forEach(prod => {
        const i = this.productos.findIndex(p => p.nombre === prod.pasillo);
        const y = this.productos[i].productos.findIndex(p => p.id === prod.id);
        if (i >= 0 && y >= 0) {
          this.productos[i].productos[y].cantidad = prod.cantidad;
          this.productos[i].productos[y].total = prod.cantidad * prod.precio;
          if (prod.cantidad === 0 ) {
            this.productos[i].productos[y].cart = false;
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
    this.productos.forEach(pasillo => {
      pasillo.productos.forEach(producto => {
        if (producto.cantidad) {
          delete producto.cantidad;
          delete producto.total;
          delete producto.cart;
        }
      });
    });
  }

  //// Action buttons

  async muestraProducto(prod, pas) {
    this.modalClosed = false;
    const modal = await this.modalController.create({
      component: FichaProductoPage,
      componentProps: { producto: prod, id: this.id, pasillo: pas, nombre: this.negocio.nombre}
    });
    modal.onDidDismiss().then(info => {
      this.modalClosed = true;
      if (info.data) {
        this.productos.forEach(pasillo => {
          pasillo.productos.forEach(producto => {
            producto.cantidad = 0;
            producto.total = 0;
            producto.cart = false;
          });
        });
        this.productos.forEach(async (p, i) => {
          this.productos[i].productos = await this.pasilloService.updateProductsQty(Object.values(p.productos));
        });
      }
    });
    return await modal.present();
  }

  async muestraPasillo(type) {
    this.modalClosed = false;
    const datos = {
      id: this.id,
      pasillo: type,
      uid: this.uid,
      vista: this.negocio.vista,
      nombre: this.negocio.nombre
    };
    const modal = await this.modalController.create({
      component: ListaPasillosPage,
      componentProps: { data: datos }
    });

    modal.onDidDismiss().then(resp => {
      this.modalClosed = true;
      if (!resp.data) { return; }
      this.productos.forEach(pasillo => {
        pasillo.productos.forEach(producto => {
          producto.cantidad = 0;
          producto.total = 0;
          producto.cart = false;
        });
      });
      this.productos.forEach(async (p, i) => {
        this.productos[i].productos = await this.pasilloService.updateProductsQty(Object.values(p.productos));
      });
    });
    return await modal.present();
  }

  async presentInfoSucursal() {
    const info = {
      id: this.negocio.id,
      nombre: this.negocio.nombre,
      status: this.negocio.status,
      telefono: this.negocio.telefono,
      lat: this.negocio.lat,
      lng: this.negocio.lng
    };
    const modal = await this.modalController.create({
      component: InfoSucursalModalPage,
      componentProps: { value: info }
    });
    return await modal.present();
  }

  llamar() {
    this.callNumber.callNumber(this.negocio.telefono, true)
      .then(res => console.log('Launched dialer!', res))
      .catch(err => console.error(err));
  }

  async muestraMapa() {
    const datos = {
      lat: this.negocio.lat,
      lng: this.negocio.lng
    };
    const modal = await this.modalController.create({
      component: MapaPage,
      componentProps: { data: datos }
    });
    return await modal.present();
  }

  async muestraComentarios() {
    const modal = await this.modalController.create({
      component: ListaComentariosModalPage,
      componentProps: { id: this.id }
    });
    return await modal.present();
  }

  async muestraPreguntas() {
    const modal = await this.modalController.create({
      component: PreguntasModalComponent,
      componentProps: {
        id: this.id,
        categoria: this.negocio.categoria
      }
    });
    return await modal.present();
  }

  //// Auxiliares

  async presentLogin(type) {
    const modal = await this.modalController.create({
      component: LoginPage,
      componentProps: { tipo: type }
    });

    modal.onDidDismiss().then(async () => {
      this.uid = await this.uidService.getUid();
      if (this.uid) {
        this.pasilloService.setUid();
        await this.pasilloService.getAllProductosFavoritos(this.id);
        await this.pasilloService.getCart(this.id);
        this.productos.forEach(async (p, i) => {
          this.productos[i].productos = await this.pasilloService.updateProductsQty(Object.values(p.productos));
          if (i + 1 === this.productos.length) {
            this.prodsReady = true;
          }
        });
        if (this.productAdd.agregar) {
          this.addProduct(
            this.productAdd.producto, this.productAdd.pasillo,
            this.productAdd.i, this.productAdd.y);
        } else if (this.productoFav.agregar) {
          this.agregarProductoFavorito(
            this.productoFav.producto, this.productoFav.i,
            this.productoFav.y);
        } else if (this.guardando) {
          this.agregarFavorito();
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

  //// Salida

  regresar() {
    this.modalController.dismiss();
  }

  regresarDelay() {
    setTimeout(() => {
      this.modalController.dismiss();
    }, 500);
  }

}
