import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { FichaOfertaPage } from '../ficha-oferta/ficha-oferta.page';
import { CategoriasService } from 'src/app/services/categorias.service';
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

  categorias = [];
  categoria = 'Destacados';
  categoriaReady = false;

  constructor(public modalController: ModalController,
              private ofertaService: OfertasService,
              private categoriasService: CategoriasService,
              ) {}

  async ngOnInit() {
  }

  async ionViewDidEnter() {
    this.getOfertasDestacadas();
  }

  getOfertasDestacadas() {
    this.ofertaService.getOfertasDestacadas().subscribe(data => {
      this.ofertas = data;
      this.getCategorias();
    });
  }

  getCategorias() {
    const cat = this.categoriasService.getCategoriasObject().subscribe( cats => {
      this.categorias = Object.keys(cats);
      this.categorias.unshift('Favoritos');
      this.categorias.unshift('Destacados');
      cat.unsubscribe();
      this.categoriaReady = true;
    }, (err) => {
      console.log('err');
    });
  }

  segmentChanged(cat) {
    if (cat.detail.value === 'Destacados') {
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
