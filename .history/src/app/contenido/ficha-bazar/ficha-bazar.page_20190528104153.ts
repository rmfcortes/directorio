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

  articulo: any;
  infoReady: boolean;

  slidesOpts = {
    initialSlide: 0,
    slidesPerView: 1,
    autoplay: true,
    loop: true,
  };

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
      const id = data['id'];
      const categoria = data['categoria'];
      try {
        const anuncio: any = await this.anuncioService.getArticuloBazar(categoria, id);
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
