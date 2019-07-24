import { Component, Input } from '@angular/core';
import { AlertController, ModalController, ToastController } from '@ionic/angular';

import { CallNumber } from '@ionic-native/call-number/ngx';

import { InfoSucursalModalPage } from '../../info-sucursal-modal/info-sucursal-modal.page';
import { LoginPage } from '../../login/login.page';

import { PasillosService } from 'src/app/services/pasillos.service';
import { NegociosService } from 'src/app/services/negocios.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { UidService } from 'src/app/services/uid.service';
import { Pregunta, Pasillo, Producto, Calificacion, Negocio,
         PrevDataNegocio, ResultNegocio, Valoraciones, Comentarios, Rates, VistaPreviaNegocio
        } from 'src/app/interfaces/negocio.interface';
import { CalificarPage } from '../../calificar/calificar.page';
import { MapaPage } from '../../mapa/mapa.page';
import { ListaComentariosModalPage } from '../../lista-comentarios-modal/lista-comentarios-modal.page';
import { ListaPasillosPage } from './lista-pasillos/lista-pasillos.page';
import { FichaProductoPage } from './ficha-producto/ficha-producto.page';
import { FichaOfertaPage } from '../../ofertas/ficha-oferta/ficha-oferta.page';

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
  hasPreguntas = false;
  resumenReady = false;

  valoraciones: Valoraciones;
  opiniones: Comentarios[];

  puntuacion = 0;

  guardado = false;
  guardando = false;

  noLongerExist = false;

  pagina = 'productos';
  hasProductos = false;
  hasOfertas = false;

  sliderConfig = {
    slidesPerView: 1,
    autoplay: true,
    centeredSlides: true,
    speed: 400
  };

  productos: Pasillo[];
  pasillos: any;
  ofertas: any;
  preguntas: Pregunta[];
  sucursales = [];

  isVisible = true;

  prodsReady = false;

  noMore = false;
  batch = 3;
  lastKey = '';

  duda: string;
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
  ofertasReady = false;
  favReady = false;

  constructor(
              private negocioService: NegociosService,
              private usuarioService: UsuarioService,
              private pasilloService: PasillosService,
              private uidService: UidService,
              public alertController: AlertController,
              private toastController: ToastController,
              private modalController: ModalController,
              private callNumber: CallNumber) {
               }

  async ionViewDidEnter() {
    this.prodsReady = false;
    this.resumenReady = false;
    this.getDatos();
  }

  async getDatos() {
    this.id = this.infoNegocio.id;
    await this.isFavorito();
    this.pasillos = await this.negocioService.getPasillos(this.id);
    const result: ResultNegocio =  await this.negocioService.getNegocio(this.id);
    const prevData: PrevDataNegocio = this.infoNegocio;
    this.negocio = {...result, ...prevData};
    if (this.negocio.ofertas > 0) { await this.hasOfer(); }

    this.uid = await this.uidService.getUid();


    this.pasilloService.setUid();
    this.pasilloService.clearLocalCart();
    if (!result) {
      this.noLongerExist = true;
      return;
    }
    if (this.negocio.hasProductos) {
      await this.getInfoProds();
    }
    this.getInfoResumen();
  }

  async getInfoResumen() {
    this.sucursales = Object.values(this.negocio.sucursales);
    if (this.negocio.preguntas > 0) { await this.getPreguntas(); }
    if (this.negocio.valoraciones > 0) {
      this.opiniones = await this.negocioService.getOpinionesMuestra(this.id);
    }
    this.resumenReady = true;
    console.log(this.negocio);
  }

  async getInfoProds() {
    return new Promise(async (resolve, reject) => {
      const destacados = await this.negocioService.getProductosDestacados(this.id);
      const destcadosArray = {
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
      this.productos = prod;
      this.productos.unshift(destcadosArray);
      this.hasProductos = true;
      if (this.uid && this.negocio.hasProductos) {
        await this.pasilloService.getAllProductosFavoritos(this.id);
        await this.pasilloService.getCart(this.id);
        this.productos.forEach(async (p, i) => {
          this.productos[i].productos = await this.pasilloService.updateProductsQty(Object.values(p.productos));
          if (i + 1 === this.productos.length) {
            this.prodsReady = true;
          }
        });
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

  async hasOfer() {
    return new Promise(async (resolve, reject) => {
      this.ofertas = await this.negocioService.getOfertasNegocio(this.id);
      this.hasOfertas = true;
      this.ofertasReady = true;
      this.pagina = 'productos';
      return resolve();
    });
  }

  async getPreguntas() {
    return new Promise(async (resolve, reject) => {
      this.preguntas = await this.negocioService.getPreguntasNegocio(this.id);
      this.hasPreguntas = true;
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

  async presentInfoSucursal(i) {
    this.sucursales[i].id = this.id;
    const modal = await this.modalController.create({
      component: InfoSucursalModalPage,
      componentProps: { value: this.sucursales[i] }
    });
    return await modal.present();
  }

  async muestraProducto(prod) {
    this.modalClosed = false;
    const modal = await this.modalController.create({
      component: FichaProductoPage,
      componentProps: { producto: prod }
    });
    return await modal.present();
  }

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
        if (this.duda) {
          this.preguntar();
        } else if (this.productAdd.agregar) {
          this.addProduct(
            this.productAdd.producto, this.productAdd.pasillo,
            this.productAdd.i, this.productAdd.y);
        } else if (this.productoFav.agregar) {
          this.agregarProductoFavorito(
            this.productoFav.producto, this.productoFav.i,
            this.productoFav.y);
        } else if (this.guardando) {
          this.agregarFavorito();
        } else if (this.puntuacion) {
          this.rateChange();
        }
      }
    });
    return await modal.present();
  }

  llamar() {
    this.callNumber.callNumber(this.negocio.telefono, true)
      .then(res => console.log('Launched dialer!', res))
      .catch(err => console.error(err));
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
        await this.pasilloService.addProductoFav(producto, this.id);
        this.productos[i].productos[y].guardado = true;
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
      await this.pasilloService.borrarProductoFavorito(this.id, prod.categoria, prod.id);
      this.productos[i].productos[y].guardado = false;
      this.presentToast('Producto eliminado de tu lista de Favoritos');
    } catch (error) {
      console.log(error);
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
      url: this.negocio.url[0],
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

  async muestraMapa(lt, lg) {
    const datos = {
      lat: lt,
      lng: lg
    };
    const modal = await this.modalController.create({
      component: MapaPage,
      componentProps: { data: datos }
    });
    return await modal.present();
  }

  async muestraComentarios(type) {
    const datos = {
      id: this.id,
      origen: type
    };
    const modal = await this.modalController.create({
      component: ListaComentariosModalPage,
      componentProps: { data: datos }
    });
    return await modal.present();
  }

  async muestraOferta(oferta) {
    this.modalClosed = false;
    const info =  {
      id: oferta,
      favorito: 'buscar'
    };
    const modal = await this.modalController.create({
      component: FichaOfertaPage,
      componentProps: { data: info }
    });

    modal.onDidDismiss().then(() => {
      this.modalClosed = true;
    });
    return await modal.present();
  }

  async muestraPasillo(type) {
    this.modalClosed = false;
    const datos = {
      id: this.id,
      pasillo: type,
      uid: this.uid
    };
    const modal = await this.modalController.create({
      component: ListaPasillosPage,
      componentProps: { data: datos }
    });

    modal.onDidDismiss().then(() => {
      this.modalClosed = true;
    });
    return await modal.present();
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

  async rateChange() {
    if (!this.uid) {
      this.presentLogin('calificar');
      return;
    }
    this.presentCalificar();
  }

  async presentCalificar() {
    const calificacion: Calificacion = {
      id: this.id,
      nombre: this.negocio.nombre,
      puntos: this.puntuacion,
      urlNegocio: this.negocio.url[0],
      categoria: this.negocio.categoria,
      subCategoria: this.negocio.subCategoria
    };
    const modal = await this.modalController.create({
      component: CalificarPage,
      componentProps: { data: calificacion }
    });

    modal.onDidDismiss().then(async (comentario) => {
      if (comentario) {
        this.opiniones.unshift(comentario.data);
        this.presentToast('Reseña publicada');
      }
    });
    return await modal.present();
  }

  async preguntar() {
    if (!this.uid) {
      this.presentLogin('pregunta');
      return;
    }
    const nuevaPregunta: Pregunta = {
      pregunta: this.duda,
      respuesta: '',
      categoria: this.negocio.categoria,
      remitente: this.negocio.id,
    };
    try {
      await this.usuarioService.publicarPregunta(nuevaPregunta, this.negocio.categoria, this.uid);
      this.preguntas.unshift(nuevaPregunta);
      this.duda = '';
      return;
    } catch (err) {
      this.presentAlertError(err);
    }
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
    this.modalController.dismiss();
  }

}
