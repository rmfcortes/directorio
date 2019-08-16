import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ModalController, IonSlides, ToastController } from '@ionic/angular';
import { Producto } from 'src/app/interfaces/negocio.interface';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Direccion } from 'src/app/interfaces/usuario.interfaces';
import { MapaPage } from '../mapa/mapa.page';
import { PasillosService } from 'src/app/services/pasillos.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart-modal',
  templateUrl: './cart-modal.component.html',
  styleUrls: ['./cart-modal.component.scss'],
})
export class CartModalComponent implements OnInit {

  @Input() cart: Producto[];
  @Input() cuenta;
  @Input() costoEnv;
  @Input() id;
  @Input() nombre;
  @Input() telefono;
  @Input() preparacion;
  @ViewChild(IonSlides) slide: IonSlides;

  original: string;
  direccion: any;
  direcciones = [];

  slideOpts = {
    initialSlide: 0,
    slidesPerView: 1,
    autoplay: false,
    loop: false,
    centeredSlides: true,
    speed: 400
  };

  posicion = 0;

  constructor(
    private modalCtrl: ModalController,
    private toastController: ToastController,
    private router: Router,
    private usuarioService: UsuarioService,
    private pasilloService: PasillosService
  ) { }

  ngOnInit() {
  }

  async ionViewDidEnter() {
    this.slide.lockSwipes(true);
    this.original = JSON.stringify(this.cart);
    const direccion = await this.usuarioService.getUltimaDireccion();
    if (direccion) {
      this.direccion = direccion;
    }
    const direcciones: any = await this.usuarioService.getDirecciones();
    if (direcciones) {
      this.direcciones = direcciones;
    }
  }

  mostrarDirecciones() {
    this.posicion++;
    this.slide.lockSwipes(false);
    this.slide.slideNext();
    this.slide.lockSwipes(true);
  }

  plusProduct(i) {
    this.cart[i].cantidad++;
    this.cart[i].total += this.cart[i].precio;
    this.cuenta += this.cart[i].precio;
  }

  minusProduct(i) {
    if (this.cart[i].cantidad === 0) { return; }
    this.cart[i].cantidad--;
    this.cart[i].total -= this.cart[i].precio;
    this.cuenta -= this.cart[i].precio;
  }

  emptyCart() {
    this.cart = [];
    this.modalCtrl.dismiss({cart: this.cart, cuenta: 0});
  }

  async ordenar() {
    if (!this.direccion) {
      this.presentToast('Agrega una dirección de entrega antes de hacer tu pedido');
      return;
    }
    if (this.cart.length === 0) {
      this.presentToast('Agrega por lo menos un artículo a tu pedido');
      return;
    }
    const detalles = {
      direccion: this.direccion,
      paso1: false,
      paso2: false,
      paso3: false,
      paso4: false,
      paso5: false,
      preparacion: this.preparacion,
      repartidor: false,
      telefonoNegocio: this.telefono
    };
    const vista = {
      activo: true,
      fecha: new Date(),
      negocio: this.nombre
    };
    try {
      // await this.usuarioService.generarPedido(this.cart, detalles, vista);
      // this.pasilloService.clearCart(this.id);
      this.router.navigate(['/tabs/pedidos-tab']);
      this.modalCtrl.dismiss({cierra: true});
    } catch (error) {
      this.presentToast(error);
    }
  }

  async presentaMapa() {
    const modal = await this.modalCtrl.create({
      component: MapaPage,
      componentProps: { data: null }
    });

    modal.onWillDismiss().then(async (resp) => {
      if (resp.data) {
        try {
          await this.usuarioService.guardaDireccion(resp.data.direccion);
          this.direcciones.push(resp.data.direccion);
          this.direccion = resp.data.direccion;
          this.regresarCarrito();
        } catch (error) {
          console.log(error);
        }
      }
    });
    return await modal.present();
  }

  regresarCarrito() {
    this.posicion--;
    this.slide.lockSwipes(false);
    this.slide.slidePrev();
    this.slide.lockSwipes(true);
  }

  closeCart() {
    if (JSON.stringify(this.cart) !== this.original) {
      this.modalCtrl.dismiss({cart: this.cart, cuenta: this.cuenta, cierra: false});
    }
    this.modalCtrl.dismiss(null);
  }

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 4000
    });
    toast.present();
  }

}
