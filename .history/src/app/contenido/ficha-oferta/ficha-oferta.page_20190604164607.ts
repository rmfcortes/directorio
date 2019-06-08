import { Component, OnInit, } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-ficha-oferta',
  templateUrl: './ficha-oferta.page.html',
  styleUrls: ['./ficha-oferta.page.scss'],
})
export class FichaOfertaPage implements OnInit {

  noLongerExist = false;

  constructor(
    private location: Location
    ) { }

  ngOnInit() {
  }

  ionViewDidEnter() {
  }

  regresar() {
    this.location.back();
  }

}
