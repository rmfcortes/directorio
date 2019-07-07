import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides } from '@ionic/angular';
import { NegociosService } from 'src/app/services/negocios.service';
import { SubCategoria, Ofertas, VistaPreviaNegocio } from 'src/app/interfaces/negocio.interface';

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

  categoria = '';
  infoReady = false;
  hasOfertas = false;

  constructor(
    private negocioService: NegociosService
  ) { }

  ngOnInit() {
  }

  mostrarLista(categoria) {
    this.categoria = categoria;
    this.slide.lockSwipes(false);
    this.slide.slideNext();
    this.slide.lockSwipes(true);
  }

  regresar() {
    this.slide.lockSwipes(false);
    this.slide.slidePrev();
    this.slide.lockSwipes(true);
  }

  async getDatos() {
    this.subCategorias = await this.negocioService.getSubCategorias(this.categoria);
    this.subCategorias.sort((a, b) => a.prioridad - b.prioridad);
    this.getOfertas();
    const negocios: VistaPreviaNegocio[] = await this.negocioService.getNegocios(this.categoria);
    this.negocios = negocios.reverse();
    this.infoReady = true;
    console.log(negocios);
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


}