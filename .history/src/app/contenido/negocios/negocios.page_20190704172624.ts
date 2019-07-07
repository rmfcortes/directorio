import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-negocios',
  templateUrl: './negocios.page.html',
  styleUrls: ['./negocios.page.scss'],
})
export class NegociosPage implements OnInit {

  infoReady = false;
  imagenes = 14;
  cuenta = 0;

  constructor() { }

  ngOnInit() {
  }

  onImageLoad() {
    console.log('Cargó');
    if (this.cuenta === this.imagenes) {
      this.infoReady = true;
      return;
    }
    this.cuenta++;
  }

}
