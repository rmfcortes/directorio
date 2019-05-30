import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { AnunciosService } from 'src/app/services/anuncios.service';

@Component({
  selector: 'app-ficha-bazar',
  templateUrl: './ficha-bazar.page.html',
  styleUrls: ['./ficha-bazar.page.scss'],
})
export class FichaBazarPage implements OnInit {

  id: string;
  articulo = {};
  infoReady: boolean;

  constructor(
    private location: Location,
    private activedRoute: ActivatedRoute,
    private anuncioService: AnunciosService
  ) { }

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
        this.articulo = anuncio;
        this.infoReady = true;
        console.log(this.articulo);
      } catch (error) {
        console.log(error);
      }
    });
  }

  regresar() {
    this.location.back();
  }

}
