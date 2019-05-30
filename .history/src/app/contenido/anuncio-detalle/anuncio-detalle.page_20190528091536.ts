import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-anuncio-detalle',
  templateUrl: './anuncio-detalle.page.html',
  styleUrls: ['./anuncio-detalle.page.scss'],
})
export class AnuncioDetallePage implements OnInit {

  constructor(private location: Location) { }

  ngOnInit() {
  }

  regresar() {
    this.location.back();
  }

}
