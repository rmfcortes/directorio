import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FichaOfertaPage } from '../ficha-oferta/ficha-oferta.page';

@Component({
  selector: 'app-ofertas',
  templateUrl: 'ofertas.page.html',
  styleUrls: ['ofertas.page.scss'],
})
export class OfertasPage {

  constructor(public modalController: ModalController) { }

  /* async presentModal(nombre) {
    const modal = await this.modalController.create({
      component: FichaOfertaPage,
      componentProps: { value: nombre }
    });
    return await modal.present();
  } */

}
