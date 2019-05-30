import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { AnunciosService } from 'src/app/services/anuncios.service';

@Component({
  selector: 'app-anuncio-detalle',
  templateUrl: './anuncio-detalle.page.html',
  styleUrls: ['./anuncio-detalle.page.scss'],
})
export class AnuncioDetallePage implements OnInit {

  id: string;
  empleo = {};
  infoReady: boolean;

  constructor(
    private location: Location,
    private activedRoute: ActivatedRoute,
    private anuncioService: AnunciosService) { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.getParams();
  }

  async getParams() {
    this.activedRoute.params.subscribe(async (data) => {
      const param = data['id'];
      try {
        this.id = param;
        const anuncio: any = await this.anuncioService.getAnuncioEmpleo(param);
        this.empleo = anuncio;
        this.infoReady = true;
        console.log(this.empleo);
      } catch (error) {
        console.log(error);
      }
    });
  }

  regresar() {
    this.location.back();
  }

}
