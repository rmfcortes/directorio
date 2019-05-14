import { Component, OnInit } from '@angular/core';
import { ModalController, LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { FichaOfertaPage } from '../ficha-oferta/ficha-oferta.page';
import { OfertasService } from '../services/ofertas.service';
import { CategoriasService } from '../services/categorias.service';

@Component({
  selector: 'app-ofertas',
  templateUrl: 'ofertas.page.html',
  styleUrls: ['ofertas.page.scss'],
})
export class OfertasPage implements OnInit {

  ofertasSub: Subscription;
  ofertas = [];
  loader: any;

  sliderConfig = {
    spaceBetween: 0
  };

  categorias = [];

  constructor(public modalController: ModalController,
              private ofertaService: OfertasService,
              private categoriasService: CategoriasService,
              private loadingCtrl: LoadingController) {}

  ngOnInit(): void {
    this.presentLoading();
    this.getOfertas();
  }

  getCategorias() {
    const cat = this.categoriasService.getCategorias().subscribe( cats => {
      this.categorias = Object.keys(cats);
      cat.unsubscribe();
      this.loader.dismiss();
    });
  }

  getOfertas() {
    this.ofertaService.getOfertas().subscribe(data => {
      console.log(data);
      this.ofertas = data;
      this.getCategorias();
    });
  }

  async presentLoading() {
    this.loader = await this.loadingCtrl.create({
     message: 'Cargando...',
     spinner: 'crescent'
    });
    return await this.loader.present();
  }

  async presentModal(oferta) {
    const modal = await this.modalController.create({
      component: FichaOfertaPage,
      componentProps: { value: oferta }
    });
    return await modal.present();
  }


}
