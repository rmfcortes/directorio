import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
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

  constructor(public modalController: ModalController,
              private ofertaService: OfertasService) { }

  ngOnInit(): void {
    this.ofertaService.getOfertas().subscribe(data => {
      console.log(data);
    });
  }

  async presentModal(imagen) {
    const modal = await this.modalController.create({
      component: FichaOfertaPage,
      componentProps: { value: imagen }
    });
    return await modal.present();
  }


}
