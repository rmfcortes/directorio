import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { FichaOfertaPage } from '../ficha-oferta/ficha-oferta.page';
import { OfertasService } from 'src/app/services/ofertas.service';

@Component({
  selector: 'app-ofertas',
  templateUrl: 'ofertas.page.html',
  styleUrls: ['ofertas.page.scss'],
})
export class OfertasPage implements OnInit {

  ofertasSub: Subscription;
  ofertas = [];

  sliderConfig = {
    spaceBetween: 0
  };

  categorias = ['Destacadas', 'Todas', 'Por Categoría'];
  categoria = 'Destacados';
  categoriaReady = false;

  constructor(public modalController: ModalController,
              private ofertaService: OfertasService,
              ) {}

  async ngOnInit() {
  }

  async ionViewDidEnter() {
    this.getOfertasDestacadas();
  }

  getOfertasDestacadas() {
    this.ofertaService.getOfertasDestacadas().subscribe(data => {
      this.ofertas = data;
      this.categoriaReady = true;
    });
  }

  segmentChanged(cat) {
    if (cat.detail.value === 'Destacadas') {
      this.ofertaService.getOfertasDestacadas().subscribe(data => {
        this.ofertas = data;
      });
      return;
    }

    this.ofertaService.getOfertasCategoria(cat.detail.value).subscribe(data => {
      this.ofertas = data;
    });
  }

  async presentModal(oferta) {
    const modal = await this.modalController.create({
      component: FichaOfertaPage,
      componentProps: { value: oferta }
    });
    return await modal.present();
  }


}
