import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { Location } from '@angular/common';

import { CallNumber } from '@ionic-native/call-number/ngx';

import { NegociosService } from 'src/app/services/negocios.service';
import { AuthService } from 'src/app/services/auth.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { InfoSucursalModalPage } from '../info-sucursal-modal/info-sucursal-modal.page';
import { UidService } from 'src/app/services/uid.service';
import { VariablesService } from 'src/app/services/variables.service';
import { PasillosService } from 'src/app/services/pasillos.service';


@Component({
  selector: 'app-ficha-negocio',
  templateUrl: './ficha-negocio.page.html',
  styleUrls: ['./ficha-negocio.page.scss'],
})
export class FichaNegocioPage implements OnInit {

  categoria: string;
  uid = '';
  id: string;
  negocio: any;
  infoReady = false;

  valoraciones = {
    resumen: {
      cantidad: 0,
      promedio: 0,
    },
    comentarios: [{
      comentario: '',
      usuario: '',
      url: '',
      fecha: '',
      puntos: ''
    }]
  };

  slidesOpts = {
    initialSlide: 0,
    slidesPerView: 1,
    autoplay: true,
    loop: true,
  };

  calificaciones = [
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

  opiniones = [];

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

  productos: any;
  pasillos: any;
  ofertas: any;
  sucursales = [];

  isVisible = true;

  isOpen = false;
  prodsReady = false;

  noMore = false;
  batch = 3;
  lastKey = '';

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
  }

  async ionViewDidEnter() {
    this.prodsReady = false;
    this.infoReady = false;
    this.getDatos();
  }

  async getDatos() {
    this.activatedRoute.params.subscribe(async (data) => {
      this.id = data['id'];
      this.categoria = data['categoria'];
      const prevData = await this.negocioService.getTemporal();
      const result =  await this.negocioService.getNegocio(this.id);
      this.uid = await this.uidService.getUid();
      this.pasilloService.setUid();
      if (!result) {
        this.noLongerExist = true;
        return;
      }
      this.negocio = {...result, ...prevData};
      this.sucursales = Object.values(this.negocio.sucursales);
      await this.hasProds();
      await this.hasOfer();
      await this.hasValora();
      await this.getPendientes();
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
      console.log(this.productos);
      this.infoReady = true;
    });
  }

  async getPendientes() {
    return new Promise(async (resolve, reject) => {
      if (!this.uid) { resolve(); }
      const pendiente = await this.variableService.getSave();
      if (pendiente) {
        const type = await this.variableService.getPendientType();
        const pos = await this.variableService.getIndex();
        if (type === 'producto') {
          await this.addProduct(this.productos[pos.pri].productos[pos.sec], this.productos[pos.pri].nombre, pos.pri, pos.sec);
        } else if (type === 'producto-favorito') {
          await this.agregarProductoFavorito(this.productos[pos.pri].productos[pos.sec], pos.pri, pos.sec);
        } else {
          await this.agregarFavorito();
        }
      }
      resolve();
      return;
    });
  }

  async hasProds() {
    return new Promise(async (resolve, reject) => {
      if (this.negocio.hasProductos) {
        const destacados = await this.negocioService.getProductosDestacados(this.id);
        const destcadosArray = {
          nombre: 'Más vendidos',
          productos: destacados
        };
        const prod: any = await this.negocioService.getProductos(this.id, this.batch + 1);
        if (prod.length === this.batch + 1) {
          this.lastKey = prod[prod.length - 1].nombre;
          prod.pop();
        } else {
          this.noMore = true;
        }
        console.log(this.lastKey);
        this.productos = prod;
        this.productos.unshift(destcadosArray);
        this.pasillos = await this.negocioService.getPasillos(this.id);
        this.hasProductos = true;
        this.pagina = 'productos';
      }
      resolve();
    });
  }

  async hasOfer() {
    return new Promise(async (resolve, reject) => {
      if (this.negocio.hasOfertas) {
        this.ofertas = await this.negocioService.getOfertasNegocio(this.id);
        this.hasOfertas = true;
      }
      resolve();
    });
  }

  async hasValora() {
    return new Promise(async (resolve, reject) => {
      if (this.negocio.hasValoraciones) {
        await this.getValoraciones();
        if (this.valoraciones.resumen.cantidad > 0) {
          await this.getCantidadValoraciones();
          await this.getOpinionesMuestra();
        }
      }
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

  getValoraciones() {
    return new Promise((resolve, reject) => {
      const valorSub = this.negocioService.getValoraciones(this.id).subscribe( (data: any) => {
        this.valoraciones = data;
        valorSub.unsubscribe();
        resolve(this.valoraciones);
      });
    });
  }

  getCantidadValoraciones() {
    return new Promise((resolve, reject) => {
      this.calificaciones.forEach( calificacion => {
        const listaFiltrada = Object.values(this.valoraciones.comentarios).filter( p => parseInt(p.puntos, 10) === calificacion.valor);
        calificacion.cantidad = listaFiltrada.length || 0.1;
      });
      resolve();
    });
  }

  getOpinionesMuestra() {
    return new Promise((resolve, reject) => {
      this.opiniones = Object.values(this.valoraciones.comentarios).slice();
      this.opiniones.sort((a, b) => parseInt(b.puntos, 10) - parseInt(a.puntos, 10));
      this.opiniones = this.opiniones.slice(0, 3);
      resolve();
    });
  }

  async addProduct(producto, pasillo, i, y) {
    return new Promise(async (resolve, reject) => {
      const resp = await this.pasilloService.addProduct(producto, pasillo, this.id, i, y);
      if (resp) {
        this.productos[i].productos[y].cart = true;
      }
      resolve();
    });
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
          delete producto.index;
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

  llamar() {
    this.callNumber.callNumber(this.negocio.telefono, true)
      .then(res => console.log('Launched dialer!', res))
      .catch(err => console.error(err));
  }

  async agregarProductoFavorito(producto, i, y) {
    if (!this.productos[i].productos[y].guardando && !this.productos[i].productos[y].guardado) {
      try {
        await this.pasilloService.addProductoFav(producto, i, y, this.id);
        this.productos[i].productos[y].guardado = true;
        this.productos[i].productos[y].guardando = false;
        this.presentToast('Producto guardado en tu lista de Favoritos');
      } catch (error) {
        this.productos[i].productos[y].guardando = false;
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
      this.variableService.setSave(true);
      this.variableService.setPendientType('favorito');
      this.router.navigate(['/login', 'menu', 'favorito']);
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
      this.variableService.setSave(false);
      this.variableService.setPendientType('');
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

  async rateChange() {
    if (!this.uid) {
      this.router.navigate(['/login', this.negocio.categoria, this.negocio.id, 'calificar', this.puntuacion]);
      return;
    }
    this.router.navigate(['/calificar', this.negocio.id, this.puntuacion]);
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
        this.productos = this.productos.concat(prod);
      } else {
        this.productos = this.productos.concat(Object.values(prod));
      }
      console.log(this.productos);
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
