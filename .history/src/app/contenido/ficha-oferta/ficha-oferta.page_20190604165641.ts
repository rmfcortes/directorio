import { Component, OnInit, } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { OfertasService } from 'src/app/services/ofertas.service';

@Component({
  selector: 'app-ficha-oferta',
  templateUrl: './ficha-oferta.page.html',
  styleUrls: ['./ficha-oferta.page.scss'],
})
export class FichaOfertaPage implements OnInit {

  oferta: any;
  infoReady = false;
  noLongerExist = false;

  constructor(
    private location: Location,
    private activedRoute: ActivatedRoute,
    private ofertaService: OfertasService
    ) { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.getParams();
  }

  async getParams() {
    this.activedRoute.params.subscribe(async (data) => {
      const id = data['id'];
      this.oferta = await this.ofertaService.getOferta(id);
      console.log(this.oferta);
      this.infoReady = true;
    });
  }

  regresar() {
    this.location.back();
  }

}
