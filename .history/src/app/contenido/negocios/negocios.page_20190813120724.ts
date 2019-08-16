import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides, ModalController } from '@ionic/angular';
import { NegociosService } from 'src/app/services/negocios.service';
import { SubCategoria, Ofertas, VistaPreviaNegocio, PrevDataNegocio } from 'src/app/interfaces/negocio.interface';
import { FichaNegocioPage } from './ficha-negocio/ficha-negocio.page';
import { OfertasPage } from '../ofertas/ofertas.page';
import { FichaOfertaPage } from '../ofertas/ficha-oferta/ficha-oferta.page';
import { ListaBazarPage } from '../lista-bazar/lista-bazar.page';
import { ListaEmpleosPage } from '../lista-empleos/lista-empleos.page';

@Component({
  selector: 'app-negocios',
  templateUrl: './negocios.page.html',
  styleUrls: ['./negocios.page.scss'],
})
export class NegociosPage implements OnInit {

  @ViewChild(IonSlides) slide: IonSlides;

  lista = false;

  slideOpts = {
    initialSlide: 0,
    slidesPerView: 1,
    autoplay: false,
    loop: false,
    centeredSlides: true,
    speed: 400
  };

  sliderOfertas = {
    slidesPerView: 1,
    autoplay: true,
    centeredSlides: true,
    speed: 400
  };

  negocios: VistaPreviaNegocio[];
  subCategorias: SubCategoria[];
  ofertas: Ofertas[];

  categoria = 'Todas';
  prodsReady = false;
  hasOfertas = false;

  constructor(
    private modalController: ModalController,
    private negocioService: NegociosService
  ) { }

  ngOnInit() {
  }

  mostrarLista(categoria) {
    this.categoria = categoria;
    this.getDatos();
    this.slide.lockSwipes(false);
    this.slide.slideNext();
    this.lista = true;
    this.slide.lockSwipes(true);
  }

  regresar() {
    this.categoria = 'Todas';
    this.slide.lockSwipes(false);
    this.slide.slidePrev();
    this.lista = false;
    this.slide.lockSwipes(true);
  }

  async getDatos() {
    this.subCategorias = await this.negocioService.getSubCategorias(this.categoria);
    this.subCategorias.sort((a, b) => a.prioridad - b.prioridad);
    this.getOfertas();
    const negocios: VistaPreviaNegocio[] = await this.negocioService.getNegocios(this.categoria);
    this.negocios = negocios.reverse();
    this.prodsReady = true;
  }

  async getOfertas() {
    const ofertas: Ofertas[] = await this.negocioService.getOfertasFiltradas(this.categoria);
    if (ofertas.length > 0) {
      this.hasOfertas = true;
      this.ofertas = ofertas.reverse();
    } else {
      this.ofertas = [];
      this.hasOfertas = false;
    }
    return;
  }

  async goDetails(negocio) {
    const modal = await this.modalController.create({
      component: FichaNegocioPage,
      componentProps: { infoNegocio: negocio, categoria: this.categoria }
    });
    return await modal.present();
  }

  async presentOfertas() {
    const modal = await this.modalController.create({
      component: OfertasPage,
      componentProps: { categoria: this.categoria }
    });
    return await modal.present();
  }

  async presentOferta(key) {
    const info = {
      id: key,
      favorito: 'buscar'
    };
    const modal = await this.modalController.create({
      component: FichaOfertaPage,
      componentProps: { data: info }
    });
    return await modal.present();
  }

  async presentBazar(tipo) {
    const modal = await this.modalController.create({
      component: ListaBazarPage,
      componentProps: { pagina: tipo}
    });
    return await modal.present();
  }

  async presentEmpleos() {
    const modal = await this.modalController.create({
      component: ListaEmpleosPage,
    });
    return await modal.present();
  }

}
