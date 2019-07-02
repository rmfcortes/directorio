import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ModalController, IonSlides } from '@ionic/angular';
import { Producto } from 'src/app/interfaces/negocio.interface';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Direccion } from 'src/app/interfaces/usuario.interfaces';
import { MapaPage } from '../mapa/mapa.page';

@Component({
  selector: 'app-cart-modal',
  templateUrl: './cart-modal.component.html',
  styleUrls: ['./cart-modal.component.scss'],
})
export class CartModalComponent implements OnInit {

  @Input() cart: Producto[];
  @Input() cuenta;
  @Input() costoEnv;
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
    private usuarioService: UsuarioService
  ) { }

  ngOnInit() {
  }

  async ionViewDidEnter() {
    this.slide.lockSwipes(true);
    this.original = JSON.stringify(this.cart);
    const direccion: any = await this.usuarioService.getUltimaDireccion();
    if (!direccion) {
      this.direccion = 'Agrega una dirección de entrega';
    } else {
      this.direccion = direccion.direccion;
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

  async presentaMapa() {
    const modal = await this.modalCtrl.create({
      component: MapaPage,
      componentProps: { data: null }
    });

    modal.onWillDismiss().then(resp => {
      if (resp.data) {
       this.direcciones.push(resp.data.direccion);
      }
    });
    return await modal.present();
  }

  direccionSeleccionada(dir) {
    console.log(dir);
  }

  regresarCarrito() {
    this.posicion--;
    this.slide.lockSwipes(false);
    this.slide.slidePrev();
    this.slide.lockSwipes(true);
  }

  closeCart() {
    if (JSON.stringify(this.cart) !== this.original) {
      this.modalCtrl.dismiss({cart: this.cart, cuenta: this.cuenta});
    }
    this.modalCtrl.dismiss(null);
  }

}
