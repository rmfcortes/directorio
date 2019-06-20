import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { NegociosService } from 'src/app/services/negocios.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-lista',
  templateUrl: './lista.page.html',
  styleUrls: ['./lista.page.scss'],
})
export class ListaPage implements OnInit, OnDestroy {


  subCategorias = [];

  categoria = '';
  negocios = [];
  ofertas = [];
  infoReady = false;
  hasOfertas = true;

  sliderConfig = {
    slidesPerView: 1,
    autoplay: true,
    centeredSlides: true,
    speed: 400,
    pager: true
  };

  constructor(private activatedRoute: ActivatedRoute,
              private negociosService: NegociosService,
              private location: Location) { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.getParams();
  }

  async getParams() {
    this.activatedRoute.params.subscribe( async (params) => {
      this.categoria = params['categoria'];
      console.log(this.categoria);
      const result: any = await this.negociosService.getSubCategorias(this.categoria);
      const ofertas: any = await this.negociosService.getOfertasFiltradas(this.categoria);
      if (ofertas) {
        this.hasOfertas = true;
        this.ofertas = ofertas.reverse();
      } else {
        this.ofertas = [];
        this.hasOfertas = false;
      }
      this.subCategorias = result;
      this.subCategorias.sort((a, b) => a.prioridad - b.prioridad);
      this.infoReady = true;
      console.log(this.subCategorias);
    });
  }

  regresar() {
    this.location.back();
  }

  ngOnDestroy(): void {
  }

}
