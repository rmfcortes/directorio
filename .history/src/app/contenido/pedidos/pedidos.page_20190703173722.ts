import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides } from '@ionic/angular';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.page.html',
  styleUrls: ['./pedidos.page.scss'],
})
export class PedidosPage implements OnInit {

  @ViewChild(IonSlides) slide: IonSlides;

  public lottieConfig: object;

  slideOpts = {
    initialSlide: 0,
    slidesPerView: 1,
    autoplay: false,
    loop: false,
    centeredSlides: true,
    speed: 400
  };

  constructor() {
    this.lottieConfig = {
      path: 'assets/animations/cart.json',
      renderer: 'canvas',
      autoplay: true,
      loop: false
    };
   }

  ngOnInit() {
    this.slide.lockSwipes(true);
  }

  mostrarDetalles() {
    this.slide.lockSwipes(false);
    this.slide.slideNext();
    this.slide.lockSwipes(true);
  }

  regresarCategorias() {
    this.slide.lockSwipes(false);
    this.slide.slidePrev();
    this.slide.lockSwipes(true);
  }

}
