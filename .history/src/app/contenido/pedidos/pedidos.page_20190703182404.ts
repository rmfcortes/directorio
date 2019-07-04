import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides } from '@ionic/angular';
import { UidService } from 'src/app/services/uid.service';
import { UsuarioService } from 'src/app/services/usuario.service';

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

  hasPedidos = false;
  infoReady = false;

  uid: string;
  pedidos = [];

  noMore = false;
  batch = 15;
  lastKey = '';

  constructor(
    private usuarioService: UsuarioService,
    private uidService: UidService
  ) {
    this.lottieConfig = {
      path: 'assets/animations/cart2.json',
      renderer: 'canvas',
      autoplay: true,
      loop: false
    };
   }

  ngOnInit() {
    this.slide.lockSwipes(true);
  }

  ionViewDidEnter() {
    this.getPedidos();
  }

  async getPedidos() {
    this.uid = await this.uidService.getUid();
    if (!this.uid) {
      this.noPedidos();
      return;
    }
    const pedidos: any = await this.usuarioService.getPedidos(this.uid, this.batch + 1);
    if (pedidos) {
      this.lastKey = pedidos[0].key;
      if (pedidos.length === this.batch + 1) {
        pedidos.shift();
      } else {
        this.noMore = true;
      }
      this.pedidos = pedidos.reverse();
      this.infoReady = true;
      this.hasPedidos = true;
    } else {
      this.noPedidos();
    }
  }

  noPedidos() {
    this.pedidos = [];
    this.infoReady = true;
    this.hasPedidos = false;
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

  async loadData(event) {
    if (this.noMore) {
      event.target.disabled = true;
      event.target.complete();
      return;
    }
    const pedidos: any = await this.usuarioService.getPedidos(this.uid, this.batch + 1, this.lastKey);
    if (pedidos) {
      this.lastKey = pedidos[0].key;
      if (pedidos.length === this.batch + 1) {
        pedidos.shift();
      } else {
        this.noMore = true;
      }
      this.pedidos = pedidos.reverse();
    }

    event.target.complete();

    // App logic to determine if all data is loaded
    // and disable the infinite scroll
    if (this.noMore) {
      event.target.disabled = true;
    }
  }

}
