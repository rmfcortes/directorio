import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { Location } from '@angular/common';

import { CallNumber } from '@ionic-native/call-number/ngx';

import { InfoSucursalModalPage } from '../info-sucursal-modal/info-sucursal-modal.page';
import { LoginPage } from '../login/login.page';

import { VariablesService } from 'src/app/services/variables.service';
import { PasillosService } from 'src/app/services/pasillos.service';
import { NegociosService } from 'src/app/services/negocios.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { UidService } from 'src/app/services/uid.service';
import { Pregunta, Pasillo, Producto, Calificacion, Negocio,
         PrevDataNegocio, ResultNegocio, Valoraciones, ComentarioVistaPrevia, Rates 
        } from 'src/app/interfaces/negocio.interface';
import { CalificarPage } from '../calificar/calificar.page';

@Component({
  selector: 'app-ficha-negocio',
  templateUrl: './ficha-negocio.page.html',
  styleUrls: ['./ficha-negocio.page.scss'],
})
export class FichaNegocioPage implements OnInit {

  categoria: string;
  uid = '';
  id: string;
  negocio: Negocio;
  hasPreguntas = false;
  infoReady = false;

  valoraciones: Valoraciones;

  slidesOpts = {
    initialSlide: 0,
    slidesPerView: 1,
    autoplay: true,
    loop: true,
  };

  calificaciones: Rates[] = [
    {
    valor: 5,
    cantidad: 0,
    },
    {
    valor: 4,
    cantidad: 0,
    },
    {
    valor: 3,
    cantidad: 0,
    },
    {
    valor: 2,
    cantidad: 0,
    },
    {
    valor: 1,
    cantidad: 0,
    }
  ];

  opiniones: ComentarioVistaPrevia[];

  categorias = 'resumen';
  puntuacion = 0;

  guardado = false;
  guardando = false;

  noLongerExist = false;

  pagina = 'resumen';
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

  isOpen = false;
  prodsReady = false;

  noMore = false;
  batch = 3;
  lastKey = '';

  duda: string;
  productAdd: {
    producto: Producto,
    pasillo: string,
    i: number,
    y: number
  };

  productoFav: {
    producto: Producto,
    i: number,
    y: number
  };

  constructor(private activatedRoute: ActivatedRoute,
              private negocioService: NegociosService,
              private usuarioService: UsuarioService,
              private pasilloService: PasillosService,
              private variableService: VariablesService,
              private uidService: UidService,
              public alertController: AlertController,
              private toastController: ToastController,
              private modalController: ModalController,
              private callNumber: CallNumber,
              private router: Router,
              private location: Location) { }

  async ngOnInit() {
    console.log('Init Ficha Negocio');
  }

  async ionViewDidEnter() {
    console.log('View Ficha Negocio');
    this.prodsReady = false;
    this.infoReady = false;
    this.getDatos();
  }

  async getDatos() {
    this.activatedRoute.params.subscribe(async (data) => {
      this.id = data['id'];
      this.categoria = data['categoria'];
      this.pasilloService.setUid();
      this.uid = await this.uidService.getUid();
      const prevData: PrevDataNegocio = await this.negocioService.getTemporal();
      const result: ResultNegocio =  await this.negocioService.getNegocio(this.id);
      if (!result) {
        this.noLongerExist = true;
        return;
      }
      this.negocio = {...result, ...prevData};
      console.log(this.negocio);
      this.sucursales = Object.values(this.negocio.sucursales);
      if (this.negocio.hasProductos) { await this.hasProds(); }
      if (this.negocio.preguntas > 0) { await this.getPreguntas(); }
      if (this.negocio.ofertas > 0) { await this.hasOfer(); }
      if (this.negocio.valoraciones > 0) { await this.hasValora(); }
      if (this.uid && this.negocio.hasProductos) {
        await this.isFavorito();
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
      this.infoReady = true;
    });
  }

  async hasProds() {
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
      this.pasillos = await this.negocioService.getPasillos(this.id);
      this.hasProductos = true;
      this.pagina = 'productos';
      resolve();
    });
  }

  async hasOfer() {
    return new Promise(async (resolve, reject) => {
      this.ofertas = await this.negocioService.getOfertasNegocio(this.id);
      this.hasOfertas = true;
      resolve();
    });
  }

  async hasValora() {
    return new Promise(async (resolve, reject) => {
      this.calificaciones = this.negocio.calificaciones;
      console.log(this.calificaciones);
      this.opiniones = await this.negocioService.getOpinionesMuestra(this.id);
      console.log(this.opiniones);
      resolve();
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
        const resp = await this.usuarioService.getFavorito(this.negocio.id, this.categoria);
        if (resp) {
          this.guardado = true;
        } else {
          this.guardado = false;
        }
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
        this.presentLogin('producto');
        return;
      }
      try {
        await this.pasilloService.addProduct(producto, pasillo, this.id);
        this.productos[i].productos[y].cart = true;
        this.productAdd = null;
      } catch (error) {
        this.productAdd = null;
        this.presentAlertError(error);
      }
  }

  plusData(data) {
    const i = this.productos.findIndex(p => p.nombre === data.producto.pasillo);
    const y = this.productos[i].productos.findIndex(p => p.id === data.producto.id);
    this.plusProduct(data.producto, i, y);
  }

  async plusProduct(producto, i, y) {
    this.productos[i].productos[y].cantidad += 1;
    this.pasilloService.plusProduct(producto, this.id);
  }

  minusData(data) {
    const i = this.productos.findIndex(p => p.nombre === data.producto.pasillo);
    const y = this.productos[i].productos.findIndex(p => p.id === data.producto.id);
    this.minusProduct(data.producto, i, y);
  }

  async minusProduct(producto, i, y) {
    this.productos[i].productos[y].cantidad -= 1;
    if (this.productos[i].productos[y].cantidad === 0) {
      this.productos[i].productos[y].cart = false;
    }
    this.pasilloService.restProduct(producto, this.productos[i].productos[y].cantidad, this.id);
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
    this.isOpen = false;
  }

  async presentInfoSucursal(i) {
    this.sucursales[i].id = this.id;
    const modal = await this.modalController.create({
      component: InfoSucursalModalPage,
      cssClass: 'my-custom-modal-css',
      componentProps: { value: this.sucursales[i] }
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
        if (this.duda) {
          this.preguntar();
        } else if (this.productAdd) {
          this.addProduct(
            this.productAdd.producto, this.productAdd.pasillo,
            this.productAdd.i, this.productAdd.y);
        } else if (this.productoFav) {
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
          this.presentLogin('favorito');
          return;
        }
        await this.pasilloService.addProductoFav(producto, i, y, this.id);
        this.productos[i].productos[y].guardado = true;
        this.productoFav = null;
        this.presentToast('Producto guardado en tu lista de Favoritos');
      } catch (error) {
        this.productoFav = null;
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

  muestraMapa(lat, lng) {
    // this.cargaInfo();
    this.router.navigate(['/mapa', lat, lng]);
  }

  muestraOfertas(oferta) {
    // this.cargaInfo();
    this.router.navigate(['/ficha-oferta', oferta, 'buscar']);
  }

  muestraPasillo(pasillo) {
    // this.cargaInfo();
    this.router.navigate(['/pasillo', this.id, pasillo]);
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
        console.log(this.opiniones);
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
    console.log(this.preguntas);
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
    this.location.back();
  }

}
