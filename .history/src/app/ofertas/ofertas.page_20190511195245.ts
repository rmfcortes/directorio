import { Component, OnInit } from '@angular/core';
import { ModalController, LoadingController } from '@ionic/angular';
import { FichaOfertaPage } from '../ficha-oferta/ficha-oferta.page';
import { OfertasService } from '../services/ofertas.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-ofertas',
  templateUrl: 'ofertas.page.html',
  styleUrls: ['ofertas.page.scss'],
})
export class OfertasPage implements OnInit {

  ofertasSub: Subscription;
  ofertas = [];
  loader: any;

  constructor(public modalController: ModalController,
              private ofertaService: OfertasService,
              private loadingCtrl: LoadingController) {}

  ngOnInit(): void {
    this.presentLoading();
    this.ofertaService.getOfertas().subscribe(data => {
      console.log(data);
      this.ofertas = data;
      this.loader.dismiss();
    });
  }

  async presentLoading() {
    this.loader = await this.loadingCtrl.create({
     message: 'Cargando...',
     spinner: 'bubbles'
   });
   return await this.loader.present();
  }

  async presentModal(imagen) {
    const modal = await this.modalController.create({
      component: FichaOfertaPage,
      componentProps: { value: imagen }
    });
    return await modal.present();
  }


}
