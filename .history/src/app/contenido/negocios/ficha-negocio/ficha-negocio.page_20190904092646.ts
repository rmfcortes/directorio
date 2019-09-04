import { Component, Input } from '@angular/core';
import { AlertController, ModalController, ToastController } from '@ionic/angular';

import { CallNumber } from '@ionic-native/call-number/ngx';

import { InfoSucursalModalPage } from '../../info-sucursal-modal/info-sucursal-modal.page';

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
  pasillos = [];
  yPasillo = 0;

  isVisible = true;

  prodsReady = false;

  noMore = false;
  batch = 3;
  batchLista = 8;
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

  infiniteCall = 1;
  productosCargados = 0;

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
    if (this.negocio.vista === 'Bloque') {
      await this.getInfoProdsBloque();
    } else if (this.negocio.vista === 'Lista') {
      await this.getInfoProdsLista();
    }
  }

  ///// Info de Productos Bloque

   async getInfoProdsBloque() {
    this.lastKey = null;
    await this.getFavs();
    this.getProdsBloque();
  }

  async getProdsBloque(event?) {
    let prod: Pasillo[] = await this.negocioService.getProductos(this.id, this.batch + 1, this.lastKey);
    if (prod) {
      for (const iterator of prod) {
        iterator.productos = await this.pasilloService.filtraFavsBloque(Object.values(iterator.productos));
      }
    }
    if (prod.length === this.batch + 1) {
      this.lastKey = prod[prod.length - 1].nombre;
      prod.pop();
    } else {
      this.noMore = true;
    }
    prod = await this.evaluaCantBloque(prod);
    if (this.productos.length === 0) {
      this.productos = [...prod];
    } else {
      this.productos = this.productos.concat(prod);
      if (event) {
        event.target.complete();
      }
    }
    this.prodsReady = true;
  }

  async evaluaCantBloque(data): Promise<Pasillo[]> {
    return new Promise(async (resolve, reject) => {
      for (const iterator of data) {
        iterator.productos = await this.pasilloService.updateProductsQtyBloque(Object.values(iterator.productos));
      }
      resolve(data);
    });
  }

  async loadData(event) {
    if (this.noMore) {
      event.target.disabled = true;
      event.target.complete();
      return;
    }
    this.getProdsBloque(event);
    // App logic to determine if all data is loaded
    // and disable the infinite scroll
    if (this.noMore) {
      event.target.disabled = true;
    }
  }

  ///// Info de Productos Lista

  async getInfoProdsLista() {
    this.infiniteCall = 1;
    this.productosCargados = 0;
    await this.getFavs();
    if (this.productos.length < this.batchLista) {
      this.lastKey = null;
      this.getProds();
    } else {
      this.prodsReady = true;
    }
  }

  async getProds(event?) {
    return new Promise(async (resolve, reject) => {
      let productos = await this.negocioService
      .getProductosLista(this.id, this.pasillos[this.yPasillo], this.batchLista + 1, this.lastKey);
      this.lastKey = productos[productos.length - 1].id;
      if (productos) {
        productos = await this.pasilloService.filtraFavs(productos);
        if (productos.length > 0) {
          this.evaluaProdsLista(productos, event);
        } else if ( this.yPasillo + 1 < this.pasillos.length ) {
          this.yPasillo++;
          this.lastKey = null;
          if (this.productosCargados < this.batchLista * this.infiniteCall) {
            this.getProds();
          }
        }
      } else if ( this.yPasillo + 1 < this.pasillos.length ) {
        this.yPasillo++;
        this.lastKey = null;
        if (this.productosCargados < this.batchLista * this.infiniteCall) {
          this.getProds();
        }
      } else {
        this.noMore = true;
        this.prodsReady = true;
        if (event) { event.target.complete(); }
        resolve();
      }
    });
  }

  async evaluaProdsLista(productos, event?) {
    if (productos.length === this.batchLista + 1) {
      productos.pop();
      await this.agregaProductos(productos, this.pasillos[this.yPasillo], event);
      this.prodsReady = true;
    } else if (productos.length === this.batchLista && this.yPasillo + 1 < this.pasillos.length) {
      await this.agregaProductos(productos, this.pasillos[this.yPasillo], event);
      this.yPasillo++;
      this.lastKey = null;
      this.prodsReady = true;
    } else if (this.yPasillo + 1 >= this.pasillos.length) {
      this.noMore = true;
      this.prodsReady = true;
      if (event) { event.target.complete(); }
    }
    if (productos.length < this.batchLista && this.yPasillo + 1 < this.pasillos.length) {
      await this.agregaProductos(productos, this.pasillos[this.yPasillo], event);
      this.lastKey = null;
      this.yPasillo++;
      if (this.productosCargados < this.batchLista * this.infiniteCall) {
        return this.getProds();
      }
      this.prodsReady = true;
    } else {
      this.agregaProductos(productos, this.pasillos[this.yPasillo], event);
      this.noMore = true;
      this.prodsReady = true;
    }
  }

  async agregaProductos(prod, pasillo, event?) {
    return new Promise(async (resolve, reject) => {
      const addProd: Producto[] = await this.evaluaCant(prod);
      this.productosCargados += addProd.length;
      const prodArray: Pasillo = {
        nombre: pasillo,
        productos: addProd
      };
      if (this.productos.length > 0 && pasillo === 'Favoritos') {
        this.productos.unshift(prodArray);
      } else {
        this.productos.push(prodArray);
      }
      if (event) { event.target.complete(); }
      console.log([...this.productos]);
      resolve();
    });
  }

  async evaluaCant(productos): Promise<Producto[]> {
    return new Promise(async (resolve, reject) => {
      for (let index = 0; index < productos.length; index++) {
        productos[index] = await this.pasilloService.updateProductsQty(productos[index]);
      }
      resolve(productos);
    });
  }

  loadDataLista(event) {
    this.infiniteCall++;
    if (this.noMore) {
      event.target.disabled = true;
      event.target.complete();
      return;
    }
    this.getProds(event);

    // App logic to determine if all data is loaded
    // and disable the infinite scroll
    if (this.noMore) {
      event.target.disabled = true;
    }
  }

  ///// Evalúa Favoritos

  async getFavs() {
    return new Promise( async (resolve, reject) => {
      await this.pasilloService.getCart(this.id);
      let prodsFav: Producto[] = await this.pasilloService.getAllProductosFavoritos(this.id);
      // if (this.pasillos[0] === 'Ofertas') {
      //   let productos = await this.negocioService.getProductosPromos(this.id);
      //   if (productos && prodsFav) {
      //     productos = await this.pasilloService.filtraFavs(productos);
      //     this.evaluaProdsLista(productos);
      //   }
      // }
      if (prodsFav) {
        prodsFav = await this.pasilloService.updateFavQty(prodsFav);
        await this.agregaProductos(prodsFav, 'Favoritos');
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
          this.presentAlertError('Al parecer no has iniciado sesión.');
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
      await this.pasilloService.borrarProductoFavorito(this.id, prod.id);
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
    if (x < 0) {
      const i = this.pasillos.indexOf(pasillo);
      console.log(i);
      const prodArray: Pasillo = {
        nombre: pasillo,
        productos: []
      };
      prodArray.productos.splice(i, 0, prod);
      if (pasillo === 'Favoritos') {
        this.productos.unshift(prodArray);
      } else {
        this.productos.push(prodArray);
      }
    } else {
      this.productos[x].productos.push(prod);
    }
  }

  async agregarFavorito() {
    this.guardando = true;
    if (!this.uid) {
      this.presentAlertError('Al parecer no has iniciado sesión.');
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

  async addProduct(producto: Producto, i: number, y: number) {
    if (!this.uid) {
      this.presentAlertError('Al parecer no has iniciado sesión.');
      return;
    }
    try {
      await this.pasilloService.addProduct(producto, this.id);
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
      this.infoReady = false;
      if (!info.data.cambios) {
        this.infoReady = true;
        return;
      }

      if (info.data.producto.guardado) {
        const indexProd = this.productos.findIndex(p => p.nombre === prod.pasillo);
        const ipp = this.productos[indexProd].productos.findIndex(pr => pr.id === prod.id);
        if (ipp >= 0) {
          this.productos[indexProd].productos.splice(ipp, 1);
          if (this.productos[indexProd].productos.length === 0) {
            this.productos.splice(indexProd, 1);
          }
        }
        const indexFav = this.productos.findIndex(p => p.nombre === 'Favoritos');
        if (indexFav < 0) {
          const ps: Pasillo   = {
            nombre: 'Favoritos',
            productos: []
          };
          ps.productos.push(info.data.producto);
          this.productos.unshift(ps);
        } else {
          const ipf = this.productos[indexFav].productos.findIndex(pr => pr.id === prod.id);
          if (ipf < 0) {
            this.productos[indexFav].productos.push(info.data.producto);
          }
        }
      } else {
        const indexFav = this.productos.findIndex(p => p.nombre === 'Favoritos');
        if (indexFav >= 0) {
          const ipf = this.productos[indexFav].productos.findIndex(pr => pr.id === prod.id);
          if (ipf >= 0) {
            this.productos[indexFav].productos.splice(ipf, 1);
            if (this.productos[indexFav].productos.length === 0) {
              this.productos.splice(indexFav, 1);
            }
          }
        }
        const indexProd = this.productos.findIndex(p => p.nombre === prod.pasillo);
        if (indexProd < 0) {
          const ps: Pasillo   = {
            nombre: prod.pasillo,
            productos: []
          };
          ps.productos.push(info.data.producto);
          this.productos.push(ps);
        } else {
          const ipp = this.productos[indexProd].productos.findIndex(pr => pr.id === prod.id);
          if (ipp < 0) {
            this.productos[indexProd].productos.push(info.data.producto);
          }
        }
      }

      this.infoReady = true;
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

    modal.onDidDismiss().then((resp: any) => {
      this.modalClosed = true;
      this.infoReady = false;
      if (!resp.data.cambios) {
        this.infoReady = true;
        return;
      }
      const prods = [];
      const favs = [];
      resp.data.prods.forEach(pro => {
        if (pro.guardado) {
          favs.push(pro);
        } else {
          prods.push(pro);
        }
      });

      const indexFav = this.productos.findIndex(p => p.nombre === 'Favoritos');
      if (indexFav >= 0) {
        this.productos[indexFav].productos = this.productos[indexFav].productos.filter(pr => pr.pasillo !== type);
        if (favs) {
          this.productos[indexFav].productos = this.productos[indexFav].productos.concat(favs);
        }
        if (this.productos[indexFav].productos.length === 0) {
          this.productos.splice(indexFav, 1);
        }
      } else {
          if (favs) {
            this.agregaProductos(favs, 'Favoritos');
          }
      }

      const index = this.productos.findIndex(p => p.nombre === type);
      if (index < 0) {
        const ps: Pasillo   = {
          nombre: type,
          productos: prods
        };
        this.productos.push(ps);
      } else {
        this.productos[index].productos = prods;
      }
      this.infoReady = true;
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
