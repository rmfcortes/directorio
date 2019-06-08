import { Component, OnInit, } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { OfertasService } from 'src/app/services/ofertas.service';
import { CallNumber } from '@ionic-native/call-number/ngx';

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
    private callNumber: CallNumber,
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
      if (!this.oferta) {
        this.noLongerExist = true;
      }
      this.infoReady = true;
    });
  }

  llamar() {
    this.callNumber.callNumber(this.oferta.telefono, true)
      .then(res => console.log('Launched dialer!', res))
      .catch(err => console.error(err));
  }

  regresar() {
    this.location.back();
  }

}
